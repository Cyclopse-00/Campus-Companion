/**
 * Firebase Cloud Messaging (FCM) helpers for push notifications.
 */

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  clickAction?: string;
  data?: Record<string, string>;
}

/**
 * Sends a push notification to an FCM device token or topic.
 * (Placeholder skeleton for Phase 0 - real FCM Admin SDK used in later phases)
 */
export async function sendPushNotification(
  tokenOrTopic: string,
  payload: PushNotificationPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (process.env.USE_MOCK === "true") {
    return {
      success: true,
      messageId: `mock-msg-${Date.now()}`,
    };
  }

  // Phase 0 skeleton - full integration in notifications phase
  return {
    success: true,
    messageId: `msg-${Date.now()}`,
  };
}
