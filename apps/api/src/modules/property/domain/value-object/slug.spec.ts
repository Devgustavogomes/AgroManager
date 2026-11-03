import { describe, it, expect } from 'vitest';
import { Slug } from './slug';

describe('Slug Value Object', () => {
  it('Should create a valid slug from simple text', () => {
    const slug = Slug.createFromText('Fazenda Feliz');
    expect(slug.slug).toBe('fazenda-feliz');
  });

  it('Should remove accents and diacritics', () => {
    const slug = Slug.createFromText('Sítio do Vovô João');
    expect(slug.slug).toBe('sitio-do-vovo-joao');
  });

  it('Should replace underscores with hyphens', () => {
    const slug = Slug.createFromText('fazenda_do_sol');
    expect(slug.slug).toBe('fazenda-do-sol');
  });

  it('Should remove special characters', () => {
    const slug = Slug.createFromText('Fazenda @#$! Nova 100%');
    expect(slug.slug).toBe('fazenda-nova-100');
  });

  it('Should remove multiple sequential spaces/hyphens', () => {
    const slug = Slug.createFromText('fazenda   muito---grande');
    expect(slug.slug).toBe('fazenda-muito-grande');
  });

  it('Should trim spaces and trailing hyphens', () => {
    const slug = Slug.createFromText('  Fazenda Central  -  ');
    expect(slug.slug).toBe('fazenda-central');
  });

  it('Should handle completely lowercase and normalized text correctly', () => {
    const slug = Slug.createFromText('fazenda-esperanca');
    expect(slug.slug).toBe('fazenda-esperanca');
  });
});
