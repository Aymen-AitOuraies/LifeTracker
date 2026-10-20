export function buildScheduleGenerationPrompt(userPrompt: string): string {
  return `
    Create a schedule based on the user's request:

    ${userPrompt}

    First, use getLastSchedules to retrieve the user's recent schedules and their tasks.

    Then, use findAllUserFeedbacks to retrieve all feedbacks provided by the user, not just feedback associated with recent schedules.

    Use previous schedules and all user feedbacks as context to understand the user's habits, routines, ongoing activities, preferred times, typical task durations, 
    preferences, and things they want to improve.

    When a task or activity from the user's request also appeared in previous schedules, use its previous duration as a baseline if the user did not specify a duration.

    Use feedback to adapt the schedule. Consider tasks the user liked, disliked, completed, skipped, or requested changes to, based on the information available in the feedback.

    IMPORTANT SCHEDULING RULES:

    1. Before assigning times to tasks, identify relevant time preferences from the user's feedback.

    2. If feedback indicates a preferred time for an activity, use that preference when scheduling the activity, even if the user did not repeat the preference in the current request.

    3. For example, if feedback indicates that lunch should be from 12:14 to 13:14, schedule lunch during exactly that interval. 
    Plan the other tasks around it instead of choosing lunch time based on a typical lunchtime.

    4. When a task has a feedback-based preferred time, schedule other tasks around that time. The preceding task must finish no later than the preferred start time, 
    and the following task must start no earlier than the preferred end time.

    5. Leave reasonable transition buffers between consecutive tasks whenever the schedule allows it. Avoid scheduling tasks back-to-back without a break unless 
    necessary to satisfy the user's explicit instructions or other constraints.

    6. Do not treat a task as well-scheduled merely because it does not overlap with another task. Consider whether there is enough time to transition between activities.

    IMPORTANT RULES:

    1. Respect all times explicitly specified by the user in the current request. For example, if the user says "gym from 4 to 5pm", the task MUST be scheduled from 16:00 to 17:00.

    2. Respect all durations explicitly specified by the user. For example, if the user says "a 1 hour tutorial", the task MUST last exactly 1 hour.

    3. If the user specifies both a start and end time, do not change them.

    4. If the user specifies a duration but not a time, choose an appropriate available time while keeping the exact duration.

    5. If the user does not specify a duration, use previous schedules to estimate a reasonable duration for that activity.

    6. Previous task times belong to previous days. Do NOT copy their exact times into today's schedule unless the user explicitly requests that or 
    the feedback indicates a relevant recurring time preference.

    7. Previous task durations can be used as a baseline for today's tasks.

    8. Do not arbitrarily increase or decrease a task's duration when historical information is available.

    9. Create a NEW schedule for today. Do not simply copy a previous schedule.

    10. Make sure tasks do not overlap with each other.

    11. Prioritize scheduling constraints in this order:
        a. Explicit times and durations in the current request.
        b. Specific time preferences expressed in user feedback.
        c. Existing schedule constraints and reasonable transition buffers.
        d. Historical schedules and inferred preferences.

    12. Never let historical data or feedback override explicit instructions in the current request.

    13. If all constraints cannot be satisfied, preserve higher-priority constraints and make the best feasible schedule without 
    silently changing explicitly requested times or durations.

    14. Use all available user feedbacks to improve the schedule, but only apply feedback that is relevant to the current scheduling request.

    Return all tasks with startTime and endTime in HH:mm format.`;
}
