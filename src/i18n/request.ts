import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const c = await cookies();
  const locale = c.get('NEXT_LOCALE')?.value || 'ro';

  let messages;
  if (locale === 'en') {
    messages = (await import('../../messages/en.json')).default;
  } else if (locale === 'de') {
    messages = (await import('../../messages/de.json')).default;
  } else {
    messages = (await import('../../messages/ro.json')).default;
  }

  return {
    locale,
    messages
  };
});
