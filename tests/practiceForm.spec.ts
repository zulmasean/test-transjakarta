import { test, expect } from '@playwright/test';
import { PracticeFormPage } from '../pages/PracticeFormPage';
import { student } from '../data/student';

test('Soal 4 - Isi dan submit Student Registration Form', async ({ page }) => {
  const form = new PracticeFormPage(page);
  await form.goto();
  await form.fillAndSubmit(student);

  await expect(form.modalTitle).toHaveText('Thanks for submitting the form');

  const expected: Record<string, string> = {
    'Student Name': `${student.firstName} ${student.lastName}`,
    'Student Email': student.email,
    'Gender': student.gender,
    'Mobile': student.mobile,
    'Date of Birth': student.expectedDateOfBirth,
    'Subjects': student.subject,
    'Hobbies': student.hobby,
    'Picture': student.picture,
    'Address': student.address,
    'State and City': `${student.state} ${student.city}`,
  };

  for (const [label, value] of Object.entries(expected)) {
    await expect(form.getModalValue(label)).toHaveText(value);
  }
});
