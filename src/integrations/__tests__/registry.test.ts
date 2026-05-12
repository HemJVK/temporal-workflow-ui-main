import { describe, it, expect } from 'vitest';
import { INTEGRATION_REGISTRY, getSchema } from '../../integrations/index';

describe('Integration Registry', () => {
  // ── Registry Integrity ─────────────────────────────────────────────────
  describe('INTEGRATION_REGISTRY', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(INTEGRATION_REGISTRY)).toBe(true);
      expect(INTEGRATION_REGISTRY.length).toBeGreaterThan(0);
    });

    it('should contain all trigger types', () => {
      const types = INTEGRATION_REGISTRY.map((i) => i.type);
      expect(types).toContain('trigger_start');
      expect(types).toContain('trigger_end');
      expect(types).toContain('trigger_schedule');
    });

    it('every schema should have required fields', () => {
      INTEGRATION_REGISTRY.forEach((schema) => {
        expect(schema.type).toBeDefined();
        expect(typeof schema.type).toBe('string');
        expect(schema.label).toBeDefined();
        expect(typeof schema.label).toBe('string');
        expect(schema.category).toBeDefined();
        expect(schema.icon).toBeDefined();
        expect(schema.description).toBeDefined();
        expect(Array.isArray(schema.inputs)).toBe(true);
      });
    });

    it('should have unique types (no duplicates)', () => {
      const types = INTEGRATION_REGISTRY.map((i) => i.type);
      const uniqueTypes = new Set(types);
      expect(uniqueTypes.size).toBe(types.length);
    });
  });

  // ── getSchema ──────────────────────────────────────────────────────────
  describe('getSchema', () => {
    it('should return schema for a known type', () => {
      const schema = getSchema('trigger_start');
      expect(schema).toBeDefined();
      expect(schema!.type).toBe('trigger_start');
      expect(schema!.label).toBe('Start Trigger');
    });

    it('should return schema for trigger_schedule', () => {
      const schema = getSchema('trigger_schedule');
      expect(schema).toBeDefined();
      expect(schema!.type).toBe('trigger_schedule');
    });

    it('should return undefined for unknown type', () => {
      const schema = getSchema('nonexistent_type');
      expect(schema).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const schema = getSchema('');
      expect(schema).toBeUndefined();
    });

    it('trigger_start should have input fields for trigger configuration', () => {
      const schema = getSchema('trigger_start');
      expect(schema!.inputs.length).toBeGreaterThan(0);

      const triggerTypeField = schema!.inputs.find((i) => i.key === 'triggerType');
      expect(triggerTypeField).toBeDefined();
      expect(triggerTypeField!.type).toBe('select');
      expect(triggerTypeField!.options).toContain('Webhook');
    });

    it('trigger_schedule should have cron input', () => {
      const schema = getSchema('trigger_schedule');
      const cronField = schema!.inputs.find((i) => i.key === 'cron');
      expect(cronField).toBeDefined();
      expect(cronField!.type).toBe('text');
    });
  });
});
