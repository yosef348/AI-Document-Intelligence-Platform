// Test file examples for Documents Module
// This file contains curl examples and integration test patterns

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

/**
 * CURL EXAMPLES FOR TESTING
 */

/*
# 1. UPLOAD A DOCUMENT
curl -X POST http://localhost:3000/documents/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "x-organization-id: YOUR_ORG_UUID" \
  -F "file=@contract.pdf" \
  -F "organizationId=YOUR_ORG_UUID" \
  -F "type=contract"

# 2. LIST ALL DOCUMENTS
curl -X GET http://localhost:3000/documents \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "x-organization-id: YOUR_ORG_UUID"

# 3. GET SINGLE DOCUMENT
curl -X GET http://localhost:3000/documents/DOCUMENT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "x-organization-id: YOUR_ORG_UUID"

# 4. DELETE (SOFT DELETE) DOCUMENT
curl -X DELETE http://localhost:3000/documents/DOCUMENT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "x-organization-id: YOUR_ORG_UUID"
*/

/**
 * INTEGRATION TEST PATTERNS
 */

describe('DocumentsModule Integration Tests', () => {
  let app: INestApplication;
  let accessToken: string;
  const organizationId = '550e8400-e29b-41d4-a716-446655440000';
  const userId = '660e8400-e29b-41d4-a716-446655440000';

  beforeAll(async () => {
    // Initialize your test app
    // const moduleFixture = await Test.createTestingModule({...}).compile();
    // app = moduleFixture.createNestApplication();
    // await app.init();
  });

  afterAll(async () => {
    // await app.close();
  });

  describe('POST /documents/upload', () => {
    it('should upload a valid PDF document', async () => {
      const response = await request(app.getHttpServer())
        .post('/documents/upload')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId)
        .field('organizationId', organizationId)
        .field('type', 'contract')
        .attach('file', Buffer.from('PDF content'), 'test.pdf')
        .set('Content-Type', 'multipart/form-data');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('signedUrl');
      expect(response.body).not.toHaveProperty('storagePath');
      expect(response.body.type).toBe('contract');
      expect(response.body.filename).toBe('test.pdf');
    });

    it('should reject invalid file type', async () => {
      const response = await request(app.getHttpServer())
        .post('/documents/upload')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId)
        .field('organizationId', organizationId)
        .field('type', 'contract')
        .attach('file', Buffer.from('text content'), 'test.txt')
        .set('Content-Type', 'multipart/form-data');

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid file type');
    });

    it('should reject missing file', async () => {
      const response = await request(app.getHttpServer())
        .post('/documents/upload')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId)
        .field('organizationId', organizationId)
        .field('type', 'contract');

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('File is required');
    });

    it('should reject invalid organization UUID', async () => {
      const response = await request(app.getHttpServer())
        .post('/documents/upload')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId)
        .field('organizationId', 'not-a-uuid')
        .field('type', 'contract')
        .attach('file', Buffer.from('PDF content'), 'test.pdf');

      expect(response.status).toBe(400);
    });

    it('should reject invalid document type', async () => {
      const response = await request(app.getHttpServer())
        .post('/documents/upload')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId)
        .field('organizationId', organizationId)
        .field('type', 'invalid-type')
        .attach('file', Buffer.from('PDF content'), 'test.pdf');

      expect(response.status).toBe(400);
    });

    it('should sanitize filename', async () => {
      const response = await request(app.getHttpServer())
        .post('/documents/upload')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId)
        .field('organizationId', organizationId)
        .field('type', 'invoice')
        .attach('file', Buffer.from('PDF content'), 'My Invoice 2026.pdf');

      expect(response.status).toBe(201);
      expect(response.body.filename).toBe('my-invoice-2026.pdf');
      expect(response.body.originalFilename).toBe('My Invoice 2026.pdf');
    });
  });

  describe('GET /documents', () => {
    it('should list all documents for organization', async () => {
      const response = await request(app.getHttpServer())
        .get('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('signedUrl');
      expect(response.body[0]).not.toHaveProperty('storagePath');
    });

    it('should reject request without organization header', async () => {
      const response = await request(app.getHttpServer())
        .get('/documents')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(400);
    });

    it('should reject request without authorization header', async () => {
      const response = await request(app.getHttpServer())
        .get('/documents')
        .set('x-organization-id', organizationId);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /documents/:id', () => {
    let documentId: string;

    beforeAll(async () => {
      // Upload a test document first
      const uploadResponse = await request(app.getHttpServer())
        .post('/documents/upload')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId)
        .field('organizationId', organizationId)
        .field('type', 'report')
        .attach('file', Buffer.from('PDF content'), 'report.pdf');

      documentId = uploadResponse.body.id;
    });

    it('should get single document by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/documents/${documentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(documentId);
      expect(response.body).toHaveProperty('signedUrl');
      expect(response.body).not.toHaveProperty('storagePath');
    });

    it('should return 404 for non-existent document', async () => {
      const response = await request(app.getHttpServer())
        .get(`/documents/00000000-0000-0000-0000-000000000000`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId);

      expect(response.status).toBe(404);
    });

    it('should prevent access to documents from other organizations', async () => {
      const otherOrgId = '770e8400-e29b-41d4-a716-446655440000';
      const response = await request(app.getHttpServer())
        .get(`/documents/${documentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', otherOrgId);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /documents/:id', () => {
    let documentId: string;

    beforeAll(async () => {
      // Upload a test document
      const uploadResponse = await request(app.getHttpServer())
        .post('/documents/upload')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId)
        .field('organizationId', organizationId)
        .field('type', 'email')
        .attach('file', Buffer.from('PDF content'), 'email.pdf');

      documentId = uploadResponse.body.id;
    });

    it('should soft delete document', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/documents/${documentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId);

      expect(response.status).toBe(204);
    });

    it('should not return deleted document in list', async () => {
      const response = await request(app.getHttpServer())
        .get('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId);

      const deletedDoc = response.body.find(
        (doc) => doc.id === documentId,
      );
      expect(deletedDoc).toBeUndefined();
    });

    it('should not return deleted document by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/documents/${documentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId);

      expect(response.status).toBe(404);
    });

    it('should return 404 when deleting non-existent document', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/documents/00000000-0000-0000-0000-000000000000`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId);

      expect(response.status).toBe(404);
    });
  });

  describe('Security & Scoping', () => {
    it('should verify organization isolation', async () => {
      const org1 = '550e8400-e29b-41d4-a716-446655440001';
      const org2 = '550e8400-e29b-41d4-a716-446655440002';

      // Upload to org1
      const upload1 = await request(app.getHttpServer())
        .post('/documents/upload')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', org1)
        .field('organizationId', org1)
        .field('type', 'contract')
        .attach('file', Buffer.from('content'), 'doc1.pdf');

      // Upload to org2
      const upload2 = await request(app.getHttpServer())
        .post('/documents/upload')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', org2)
        .field('organizationId', org2)
        .field('type', 'contract')
        .attach('file', Buffer.from('content'), 'doc2.pdf');

      // List org1 documents
      const list1 = await request(app.getHttpServer())
        .get('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', org1);

      // Ensure org2's document is not in org1's list
      expect(list1.body.every((doc) => doc.organizationId === org1)).toBe(
        true,
      );
    });

    it('should never expose storagePath in any response', async () => {
      const response = await request(app.getHttpServer())
        .get('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId);

      expect(response.status).toBe(200);
      response.body.forEach((doc) => {
        expect(doc).not.toHaveProperty('storagePath');
        expect(doc).toHaveProperty('signedUrl');
      });
    });

    it('should include proper metadata in responses', async () => {
      const response = await request(app.getHttpServer())
        .post('/documents/upload')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-organization-id', organizationId)
        .field('organizationId', organizationId)
        .field('type', 'other')
        .attach('file', Buffer.from('content'), 'test.pdf');

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('uploadedBy');
      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('filename');
      expect(response.body).toHaveProperty('originalFilename');
      expect(response.body).toHaveProperty('mimeType');
      expect(response.body).toHaveProperty('sizeBytes');
      expect(response.body).toHaveProperty('checksum');
      expect(response.body).toHaveProperty('parsingStatus');
      expect(response.body).toHaveProperty('processingStatus');
      expect(response.body).toHaveProperty('createdAt');
    });
  });
});

