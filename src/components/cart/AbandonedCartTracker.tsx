'use client';
import { useEffect, useRef } from 'react';
import { useCart } from '@/lib/cart';
import { createClient } from '@/lib/supabase/client';

const SESSION_KEY = 'sultania_session_id';
const IDLE_MS = 5 * 60 * 1000; // 5 minutes
const SAVE_INTERVAL_MS = 30 * 1000; // 30 seconds

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function AbandonedCartTracker() {
  const { items, total } = useCart();
  const lastActivityRef = useRef<number>(Date.now());
  const savedCartIdRef = useRef<string | null>(null);

  // Track user activity
  useEffect(() => {
    const update = () => { lastActivityRef.current = Date.now(); };
    window.addEventListener('mousemove', update, { passive: true });
    window.addEventListener('keydown', update, { passive: true });
    window.addEventListener('touchstart', update, { passive: true });
    return () => {
      window.removeEventListener('mousemove', update);
      window.removeEventListener('keydown', update);
      window.removeEventListener('touchstart', update);
    };
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const interval = setInterval(async () => {
      const idleTime = Date.now() - lastActivityRef.current;
      if (idleTime < IDLE_MS) return; // user is still active

      const supabase = createClient();
      const sessionId = getSessionId();
      const cartItems = items.map((i) => ({
        id: i.id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      }));

      if (savedCartIdRef.current) {
        // Update existing record
        await supabase
          .from('abandoned_carts')
          .update({ items: cartItems, total, updated_at: new Date().toISOString() })
          .eq('id', savedCartIdRef.current);
      } else {
        // Insert new record
        const { data } = await supabase
          .from('abandoned_carts')
          .insert({ session_id: sessionId, items: cartItems, total })
          .select('id')
          .single();
        if (data) savedCartIdRef.current = data.id;
      }
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [items, total]);

  return null;
}
