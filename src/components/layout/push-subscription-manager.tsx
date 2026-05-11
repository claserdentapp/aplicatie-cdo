"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushSubscriptionManager() {
  useEffect(() => {
    // Only run in the browser and if Service Workers are supported
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      registerServiceWorkerAndSubscribe();
    }
  }, []);

  async function registerServiceWorkerAndSubscribe() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Only subscribe if logged in

      const registration = await navigator.serviceWorker.register("/sw.js");
      
      // Request permission immediately (this might be better triggered by a button in real scenarios, but for internal tools, auto-prompt is fine)
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return;
      }

      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Subscribe
        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicKey) return;

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      // Extract keys
      const rawSub = JSON.parse(JSON.stringify(subscription));
      const authKey = rawSub.keys?.auth;
      const p256dhKey = rawSub.keys?.p256dh;
      const endpoint = rawSub.endpoint;

      if (!endpoint || !authKey || !p256dhKey) return;

      // Save to Supabase (upsert based on unique endpoint)
      // Since it's a unique constraint, if it exists and errors out, we can ignore or we can update
      const { error } = await supabase.from("push_subscriptions").upsert(
        {
          user_id: user.id,
          endpoint,
          auth_key: authKey,
          p256dh_key: p256dhKey,
        },
        { onConflict: 'endpoint' }
      );

      if (error && error.code !== '23505') {
         console.error("Error saving push subscription", error);
      }
      
    } catch (err) {
      console.error("Service worker registration failed", err);
    }
  }

  return null;
}
