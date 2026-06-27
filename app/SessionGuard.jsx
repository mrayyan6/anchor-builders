'use client';
import { useEffect } from 'react';
import { createClient } from '../utils/supabase/client';

const IDLE_MS = 30 * 60 * 1000; // 30 minutes of no user interaction

// Handles two session expiry rules:
// 1. Idle timeout — signs out after 30 min of no mouse/keyboard/scroll activity.
// 2. Tab-close logout — sessionStorage clears when a tab or browser closes; on
//    next open the app detects no active-session flag and forces re-login.
export default function SessionGuard() {
  useEffect(() => {
    const supabase = createClient();
    let idleTimer = null;
    let isTracking = false;
    const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

    async function doSignOut() {
      stopTracking();
      sessionStorage.removeItem('anch_active');
      await supabase.auth.signOut();
      window.location.href = '/login';
    }

    function resetIdleTimer() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(doSignOut, IDLE_MS);
    }

    function startTracking() {
      if (isTracking) return;
      isTracking = true;
      ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }));
      resetIdleTimer();
    }

    function stopTracking() {
      if (!isTracking) return;
      isTracking = false;
      clearTimeout(idleTimer);
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, resetIdleTimer));
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Mark this browser tab as having an active session.
        sessionStorage.setItem('anch_active', '1');
        startTracking();
      } else if (event === 'SIGNED_OUT') {
        stopTracking();
        sessionStorage.removeItem('anch_active');
      } else if (event === 'INITIAL_SESSION') {
        if (session) {
          if (!sessionStorage.getItem('anch_active')) {
            // Auth cookies exist but this tab was freshly opened (sessionStorage is
            // per-tab and clears on close) — treat as if the previous session ended.
            doSignOut();
          } else {
            startTracking();
          }
        }
      }
    });

    return () => {
      stopTracking();
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
