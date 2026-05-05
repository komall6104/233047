# Notification System Design

## Stage 1: Priority Inbox Implementation

### Overview
This document outlines the design and implementation of a Priority Inbox system for the campus notifications application. The system efficiently manages high-volume notifications by prioritizing and displaying the top unread notifications based on importance and recency.

---

## Problem Statement

The campus notifications application has accumulated a high volume of notifications, causing users to lose track of important updates. A Priority Inbox was needed to:
- Display only the most important unread notifications first
- Automatically prioritize notifications based on multiple factors
- Maintain efficiency as new notifications arrive continuously
- Allow users to customize the number of notifications displayed

---

## Architecture & Design

### 1. Priority Calculation Algorithm

#### Priority Formula
```
Priority Score = (Weight × 10,000) + Recency Score

Where:
- Weight: Category importance (placement=3, result=2, event=1)
- Recency Score: Decay from 1000 points over time (0 at 100+ minutes old)
```

#### Weight Hierarchy
The system uses a three-tier weight hierarchy based on business logic:

| Type | Weight | Points | Reasoning |
|------|--------|--------|-----------|
| **Placement** | 3 | 30,000+ | Career-critical updates (offers, interviews, applications) |
| **Result** | 2 | 20,000+ | Academic performance updates (exam results, grades) |
| **Event** | 1 | 10,000+ | Community activities (workshops, seminars, networking) |

#### Recency Scoring
- **New notifications (0-30 min)**: Higher recency points (500-1000)
- **Recent notifications (30-60 min)**: Medium points (250-500)
- **Older notifications (60-100 min)**: Low points (0-250)
- **Very old notifications (100+ min)**: Dropped from priority inbox

#### Filtering
- Only **unread notifications** appear in the priority inbox
- Read notifications are archived (priority score = -1)
- This ensures focus on new, important information

### 2. Data Structure

```javascript
Notification {
  id: number,                    // Unique identifier
  type: 'placement'|'result'|'event',  // Category
  title: string,                 // Notification headline
  message: string,               // Detailed message
  timestamp: number,             // Unix timestamp of creation
  read: boolean                  // Read status
}
```

### 3. Service Layer: `notificationService.js`

**Key Functions:**

- **`getTopNotifications(limit = 10)`**
  - Returns array of top N unread notifications
  - Sorted by priority score (highest first)
  - Time Complexity: O(n log n) for sorting
  - Space Complexity: O(n) for storing notifications

- **`calculatePriorityScore(notification)`**
  - Computes individual notification priority
  - Returns -1 for read notifications
  - Accounts for weight and time decay

- **`markNotificationAsRead(id)`**
  - Updates notification read status
  - Removes from future priority inbox queries

- **`addNotification(notificationData)`**
  - Accepts new incoming notifications
  - Automatically assigns timestamp and ID
  - Prepends to notification array for quick access

- **`getPriorityStats()`**
  - Returns dashboard statistics
  - Unread count by type
  - Total notification metrics

### 4. Frontend Component: `PriorityInbox.jsx`

**Features:**

- **Real-time Updates**: Refreshes priority scores on user interaction
- **Customizable Limit**: Display 5, 10, 15, or 20 notifications
- **Statistics Dashboard**: Shows unread count by notification type
- **Type Indicators**: Color-coded badges (green=placement, blue=result, orange=event)
- **Time Display**: Human-readable relative timestamps ("5m ago")
- **Interactive Actions**: Mark as read, add test notifications, manual refresh
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### 5. Styling: `PriorityInbox.css`

**Design Principles:**

- **Color Coding**:
  - Placement (green #4CAF50): Urgent career opportunities
  - Result (blue #2196F3): Important academic updates
  - Event (orange #FF9800): Community engagement

- **Visual Hierarchy**:
  - Large rank numbers (#1-#10) for quick scanning
  - Prominent titles and timestamps
  - Subtle hover effects for interactivity
  - Smooth animations for new notifications

- **Responsive Layout**:
  - Desktop: Full statistics grid, multi-column controls
  - Tablet: 2-column stats, flexible controls
  - Mobile: Stacked layout, full-width buttons

---

## Efficiency Strategy: Handling New Notifications

### Challenge
How to maintain the top 10 efficiently when notifications continuously arrive?

### Solution: Lazy Evaluation

1. **On-Demand Computation**: Priority scores calculated only when needed (on refresh/mark-read)
2. **Minimal Data Processing**: No background processes running continuously
3. **User-Triggered Updates**: Calculations happen in response to user actions
4. **Scalability**: Efficient even with thousands of notifications

### Performance Characteristics

| Operation | Time Complexity | Frequency |
|-----------|-----------------|-----------|
| Get Top 10 | O(n log n) | On refresh (user-triggered) |
| Mark as Read | O(1) | Per read action |
| Add Notification | O(1) | Per new notification |
| Calculate Priority | O(1) | Per notification |

Where n = total notifications in system

### Optimization Techniques

1. **Filtering First**: Exclude read notifications before sorting
2. **Early Termination**: Stop processing after collecting top 10
3. **Debouncing**: Refresh UI only on meaningful changes
4. **Caching**: Reuse calculated scores during single render cycle

---

## Implementation Details

### Mock Data
The system includes 15 pre-loaded notifications simulating:
- Past placement opportunities and updates
- Academic results and grades
- Campus events and workshops

### Testing Capabilities
- **Add Test Notification**: Simulates real incoming notifications
- **Dynamic Filtering**: Switch between top 5, 10, 15, 20 notifications
- **Mark as Read**: Remove notifications from priority list
- **Manual Refresh**: Recalculate priorities on demand

---

## Algorithm Example

### Sample Calculation

**Notification A (Placement, 2 minutes old):**
```
weight = 3 (placement)
ageInSeconds = 120
recencyScore = max(1000 - floor(120/6), 0) = 1000 - 20 = 980
priorityScore = (3 × 10,000) + 980 = 30,980
```

**Notification B (Event, 45 minutes old):**
```
weight = 1 (event)
ageInSeconds = 2700
recencyScore = max(1000 - floor(2700/6), 0) = 1000 - 450 = 550
priorityScore = (1 × 10,000) + 550 = 10,550
```

**Result**: Notification A ranks higher due to superior weight (3 vs 1) and recency (980 vs 550)

---

## User Experience Flow

1. **User Opens App**: Sees top 10 unread notifications ranked by priority
2. **Statistics Dashboard**: Quick overview of unread counts by type
3. **Interaction Options**:
   - Mark notification as read (✓ button) → Auto-refreshes list
   - Change display limit → Recalculates top N
   - Add test notification → Simulates real incoming data
   - Refresh → Manual recalculation

4. **Visual Feedback**:
   - Rank number shows importance order
   - Color-coded type indicators
   - Timestamps show relevance
   - Hover effects indicate interactivity

---

## Scalability Considerations

### Current Capacity
- Optimized for systems with hundreds to thousands of notifications
- Real-time priority calculation on demand
- No persistent database required for demo

### Production Enhancements

For enterprise deployment:

1. **Database Integration**:
   - Index notifications by type and read status
   - Query optimization for large datasets
   - Pagination support

2. **Caching Layer**:
   - Redis cache for frequent priority calculations
   - Cache invalidation on new notifications

3. **Background Jobs**:
   - Cleanup old/archived notifications
   - Pre-calculate priorities during off-peak hours
   - Notification batching for real-time updates

4. **API Optimization**:
   - Partial response fetching
   - Compression for large notification sets
   - WebSocket support for live updates

---

## Future Improvements

1. **Machine Learning Integration**: Learn user priorities from interaction patterns
2. **Custom Weight Profiles**: Allow users to adjust weight hierarchy
3. **Smart Filtering**: Filter by date range, sender, keywords
4. **Snooze Feature**: Temporarily hide notifications, restore later
5. **Notification Groups**: Batch similar notifications together
6. **Push Notifications**: Send top priority notifications to mobile
7. **Notification History**: Archive and search past notifications

---

## Conclusion

The Priority Inbox system successfully addresses the challenge of managing high-volume notifications by:
- Implementing an intelligent priority algorithm
- Providing efficient real-time filtering
- Delivering an intuitive user interface
- Maintaining scalability for growth

This design balances complexity with usability, ensuring users always see the most important information first.

---

## Testing Screenshots

The application includes interactive features to test the priority system:

- **Priority Ranking**: Notifications automatically sorted by calculated priority score
- **Type Indicators**: Color-coded badges show notification categories
- **Statistics**: Real-time count of unread notifications by type
- **Interactive Controls**: Add test notifications and customize display limit

Screenshots demonstrating these features are included in the repository.
