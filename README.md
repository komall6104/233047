# Priority Inbox Notification System

A React + Vite application that implements an intelligent notification prioritization system for a campus notifications platform.

## Features

- **Smart Priority Algorithm**: Notifications ranked by weight (placement > result > event) and recency
- **Top N Display**: Customizable display of top 5, 10, 15, or 20 notifications
- **Real-time Updates**: Add test notifications and see dynamic reranking
- **Interactive UI**: Mark notifications as read, refresh priority scores
- **Dashboard Statistics**: See unread counts by notification type
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Project Structure

```
src/
├── components/
│   ├── PriorityInbox.jsx        # Main component
│   └── PriorityInbox.css        # Component styles
├── services/
│   └── notificationService.js   # Priority calculation logic
├── App.jsx                      # Main app component
├── App.css                      # App styles
├── main.jsx                     # Entry point
└── index.css                    # Global styles

Notification_System_Design.md     # Design documentation
README.md                         # This file
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or next available port)

### Build

```bash
npm run build
```

## How It Works

### Priority Algorithm

The priority score is calculated as:

```
Priority Score = (Weight × 10,000) + Recency Score
```

**Weight Hierarchy:**
- PLACEMENT notifications: Weight 3 (career-critical)
- RESULT notifications: Weight 2 (academic performance)
- EVENT notifications: Weight 1 (community activities)

**Recency Scoring:**
- Newer notifications receive higher recency scores
- Scores decay over time (approximately 1000 points per 100 minutes)
- Only unread notifications appear in the priority inbox

### Notification Object

```javascript
{
  id: number,
  type: 'placement' | 'result' | 'event',
  title: string,
  message: string,
  timestamp: number,  // Unix timestamp
  read: boolean
}
```

## API Reference

### `notificationService.js`

- **`getTopNotifications(limit = 10)`**: Returns top N unread notifications
- **`getAllNotifications()`**: Returns all notifications
- **`markNotificationAsRead(id)`**: Mark a notification as read
- **`addNotification(notificationData)`**: Add a new notification
- **`getPriorityStats()`**: Get statistics about notifications

## User Interface

- **Statistics Dashboard**: Shows total unread and breakdown by type
- **Controls**: 
  - Limit selector (top 5, 10, 15, 20)
  - Add test notification button
  - Refresh button
- **Notification Cards**:
  - Rank number (#1-#10)
  - Type indicator (color-coded)
  - Title and message
  - Timestamp (relative, e.g., "5m ago")
  - Mark as read button

## Customization

### Changing Weights

Edit the `WEIGHT_HIERARCHY` object in `notificationService.js`:

```javascript
const WEIGHT_HIERARCHY = {
  'placement': 3,
  'result': 2,
  'event': 1
};
```

### Adjusting Recency Decay

Modify the recency calculation in `calculatePriorityScore()`:

```javascript
const recencyScore = Math.max(1000 - Math.floor(ageInSeconds / 6), 0);
```

### Mock Data

Update the `notifications` array in `notificationService.js` to change default test data.

## Performance Considerations

- **Time Complexity**: O(n log n) for priority calculation and sorting
- **Space Complexity**: O(n) for storing notifications
- **Efficient for**: Systems with hundreds to thousands of notifications
- **Calculation Trigger**: On-demand (when user interacts with the app)

## Future Enhancements

- Machine learning integration for personalized priorities
- Custom weight profiles per user
- Notification snooze feature
- Smart filtering and search
- Push notification support
- Notification history and archive
- WebSocket support for real-time updates

## Technologies Used

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: CSS3 with Flexbox and Grid
- **State Management**: React Hooks (useState, useEffect)

## License

MIT License

---

For detailed design documentation, see [Notification_System_Design.md](./Notification_System_Design.md)

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# 233047
# 233047
