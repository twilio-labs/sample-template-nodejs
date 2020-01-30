// type definitions for Cypress object "cy"
// eslint-disable-next-line
/// <reference types="cypress" />

// check this file using TypeScript if available
// @ts-check

describe('/example', () => {
  it('returns a valid JSON', () => {
    cy.request('/example').then(resp => {
      expect(resp.body).to.have.property('example', true);
    });
  });
});
