import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from "@/lib/supabase/server";

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  'mailto:contact@claserdent.ro', // Should be a valid email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const body = await request.json();
    const { title, message, url, targetRole } = body;

    // Fetch the target users' push subscriptions
    let subscriptions: any[] = [];
    let fetchError: any = null;

    if (targetRole === 'admin') {
      const { data, error } = await supabase.rpc('get_admin_push_subscriptions');
      subscriptions = data || [];
      fetchError = error;
    } else {
      // Default to standard query if not 'admin'
      const { data, error } = await supabase.from('push_subscriptions').select('endpoint, auth_key, p256dh_key, user_id');
      subscriptions = data || [];
      fetchError = error;
    }

    if (fetchError) {
       console.error("Error fetching subscriptions:", fetchError);
       return new NextResponse('Internal Error', { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscriptions found' });
    }

    const payload = JSON.stringify({
      title: title || 'Notificare Nouă',
      body: message || '',
      url: url || '/',
    });

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            auth: sub.auth_key,
            p256dh: sub.p256dh_key,
          },
        };
        await webpush.sendNotification(pushSubscription, payload);
      } catch (err: any) {
        console.error("Failed to send push to endpoint", sub.endpoint, err);
        // If the subscription is no longer valid (e.g. 410 Gone), we should remove it from the DB
        if (err.statusCode === 404 || err.statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
        }
      }
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("Push Notification error:", err);
    return new NextResponse(`Error: ${err.message}`, { status: 500 });
  }
}
