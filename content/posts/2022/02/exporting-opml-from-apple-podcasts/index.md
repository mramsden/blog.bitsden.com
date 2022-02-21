---
title: Exporting OPML feed from Apple Podcasts
date: 2022-02-21T00:00:00Z
type: post
---

I was wanting to try out Overcast on iOS and needed a way to export my subscriptions. Unfortunately the Apple Podcasts app does not support exporting your subscriptions as an OPML feed.

I found this on the [Apple Stack Exchange](https://apple.stackexchange.com/questions/374696/exporting-podcasts-from-ios-app-as-opml) site which let me create an OPML file from the subscriptions database created by the Apple Podcasts app. This will only work for you on macOS as it's not easy to get access to the database used by the iOS version of the app.

{{% code file="/content/posts/2022/02/exporting-opml-from-apple-podcasts/export_podcasts.sh" language="bash" %}}
