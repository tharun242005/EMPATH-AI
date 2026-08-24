using System;
using System.Linq;
using Windows.UI.Notifications.Management;
using Windows.UI.Notifications;

namespace EmpathAI.WinBridge
{
    public sealed class NotificationBridge
    {
        private static UserNotificationListener listener = UserNotificationListener.Current;

        public static async void StartListening()
        {
            var access = await listener.RequestAccessAsync();

            if (access == UserNotificationListenerAccessStatus.Allowed)
            {
                listener.NotificationChanged += OnNotificationChanged;
                System.Diagnostics.Debug.WriteLine("✅ EmpathAI WinBridge: Listening to notifications...");
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("❌ Access denied for notification reading.");
            }
        }

        private static async void OnNotificationChanged(UserNotificationListener sender, UserNotificationChangedEventArgs args)
        {
            try
            {
                var notes = await sender.GetNotificationsAsync(NotificationKinds.Toast);
                foreach (var note in notes)
                {
                    var appName = note.AppInfo.DisplayInfo.DisplayName;
                    var binding = note.Notification.Visual.GetBinding(KnownNotificationBindings.ToastGeneric);
                    var text = string.Join(" ", binding.GetTextElements().Select(t => t.Text));

                    System.Diagnostics.Debug.WriteLine($"🔔 [{appName}] {text}");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"⚠️ WinBridge Error: {ex.Message}");
            }
        }
    }
}


