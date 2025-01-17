export default function conditionallyLoadAnalytics({
  writeKey,
  destinations,
  destinationPreferences,
  isConsentRequired
  // ShouldReload = true
}) {
  const integrations = {All: false, 'Segment.io': true}
  let isAnythingEnabled = false

  if (!destinationPreferences) {
    if (isConsentRequired) {
      return
    }

    // Load a.js normally when consent isn't required and there's no preferences
    if (!window.analytics.initialized) {
      window.analytics.load(writeKey)
    }
    return
  }

  for (const destination of destinations) {
    const isEnabled = Boolean(destinationPreferences[destination.id])
    if (isEnabled) {
      isAnythingEnabled = true
    }
    integrations[destination.id] = isEnabled
  }

  // Reload the page if the trackers have already been initialised so that
  // the user's new preferences can take affect
  if (window.analytics.initialized) {
    // If (shouldReload) {
    //   // window.location.reload()
    // }
    // window.analytics.page();
    window.analytics.page(window.location.pathname, {
      title: document.title,
      url: window.location.hostname,
      path: window.location.pathname
    })
    return
  }

  // Don't load a.js at all if nothing has been enabled
  if (isAnythingEnabled) {
    window.analytics.load(writeKey, {integrations})
  }
}
