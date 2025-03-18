import { fixture, html, expect } from '@open-wc/testing';
import '../src/components/employee-list.js';
import { store } from '../src/store.js';

describe('Employee List Component', () => {
  beforeEach(() => {
    store.employees = [
      { id: '1', firstName: 'Alice', lastName: 'Johnson', department: 'Tech', position: 'Senior' }
    ];
  });

  it('renders employee records', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const rows = el.shadowRoot.querySelectorAll('tr');
    expect(rows.length).to.equal(2); // 1 header + 1 employee row
  });

  it('deletes an employee', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const deleteButton = el.shadowRoot.querySelector('button');
    deleteButton.click();
    expect(store.employees.length).to.equal(0);
  });
});
