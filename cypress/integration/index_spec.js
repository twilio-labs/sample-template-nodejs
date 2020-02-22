// type definitions for Cypress object "cy"
// eslint-disable-next-line
/// <reference types="cypress" />

// check this file using TypeScript if available
// @ts-check

describe('/', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('contains title', () => {
    cy.get('h1').contains('Template App');
  });

  it('contains a link to /example', () => {
    const link = cy.get('a[href="/example"]');
    link.contains('/example');
  });

  it('sends an sms', () => {
    cy.server();
    cy.route('POST', '/send-sms', 'fixture:send-sms.json').as(
      'sendSmsActivity'
    );

    cy.get('#toInput')
      .clear()
      .type('+12223334444');
    cy.get('#bodyInput')
      .clear()
      .type('This is a test message');
    cy.get('#smsForm').submit();
    cy.wait('@sendSmsActivity')
      .its('requestBody')
      .should('deep.equal', {
        to: '+12223334444',
        body: 'This is a test message',
      });
    cy.get('#dialogTitle').contains('SMS Sent!');
    const dialog = cy.get('#dialog');
    dialog.should('have.class', 'alert-success');
    dialog.should('not.have.class', 'd-none');
    cy.get('#dialogContent').contains('Your SMS has been sent!');
  });

  it('shows error message', () => {
    cy.server();
    cy.route('POST', '/send-sms', 'fixture:error-send-sms.json').as(
      'sendSmsActivity'
    );

    cy.get('#toInput')
      .clear()
      .type('+12223339999');
    cy.get('#bodyInput')
      .clear()
      .type('This is a test message with the intention to fail');
    cy.get('#smsForm').submit();
    cy.wait('@sendSmsActivity')
      .its('requestBody')
      .should('deep.equal', {
        to: '+12223339999',
        body: 'This is a test message with the intention to fail',
      });
    cy.get('#dialogTitle').contains('Error');
    const dialog = cy.get('#dialog');
    dialog.should('have.class', 'alert-danger');
    dialog.should('not.have.class', 'd-none');
    cy.get('#dialogContent').contains('Oh no :( something went wrong.');
  });
});
