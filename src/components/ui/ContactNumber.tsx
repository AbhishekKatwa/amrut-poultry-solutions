import type { MouseEvent } from 'react';
import PhoneInput from 'react-phone-input-2';
import clsx from 'clsx';
import { BRAND } from '@/lib/content';
import 'react-phone-input-2/lib/style.css';

/**
 * The company's contact number, rendered through react-phone-input-2 so it reads as a real,
 * country-formatted phone number. Read-only: this is a contact detail, not a form field.
 */
export function ContactNumber({ className }: { className?: string }) {
  return (
    <div className={clsx('contact-phone', className)}>
      <PhoneInput
        country={BRAND.contact.country}
        /** The widget formats from the dial code, so it gets the full number. */
        value={`${BRAND.contact.dialCode}${BRAND.contact.number}`}
        onlyCountries={[BRAND.contact.country]}
        disableDropdown
        disableCountryGuess
        inputProps={{
          readOnly: true,
          'aria-label': `Contact ${BRAND.company} on ${BRAND.contact.display}`,
          onClick: (event: MouseEvent<HTMLInputElement>) => event.currentTarget.select(),
        }}
      />
    </div>
  );
}
