---
title: "Upgrade Gradle Wrapper"
date: 2019-04-13
type: post
---

I wanted to make use of Kotlinscript build files as port of the Gradle build process and one of the tips was to upgrade to the latest version of Gradle. Turns out it's easy to do:

```shell
./gradlew wrapper --gradle-version=5.3.1
```

The only bit you'll want to watch out for is you pick a version of Gradle that is supported by the Android plugin.
