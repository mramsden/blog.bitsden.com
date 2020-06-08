---
title: "Passing Data From Laravel to Vue"
date: 2017-05-28
type: post
---

In order to progressively enhance my [Laravel](https://laravel.com/) templates I have been using [Vue.js](https://vuejs.org/). One problem that I was grappling with is that one of my components was actually behaving more like an application and needs a load of startup data.

Options to solving the problem included:

1. Performing an api request for the data using the application component once it had been mounted.
2. Attaching the data into the Javascript context using the blade template.

I chose option 2 as this reduces the total number of requests that the page needs to make, I wouldn’t need to create an API endpoint which I’m not yet ready to expose in my app and I have all the data I need in the request that makes the original blade page thanks to there being permissions checks.

# Encoding

The snippet for encoding the data in blade is pretty simple:

```php
{!! json_encode($surveyData) !!}
```

This will take the data in the variable and encode it as a JSON object which Javascript can handle natively.

# Injecting the data

Now to inject the data I needed to get it from the context of a static string in blade and into my component. Since my application lived under this component I chose component properties as a means of injecting the data. In the component I first needed to register the property:

```js
<script>
export default {
    props: ['surveyData'],
    mounted () {
        // Do something useful with the data in the template
        console.dir(this.surveyData)
    }
}
</script>
```

Now all I needed to do was register my component with my Vue app and then add the following to my blade template:

```html
<survey-component :survey-data="'{!! json_encode($surveyData) !!}'"></survey-component>
```

I am a fan of this approach as the Vue component does not need to rely on global state from the window object and data is passed straight to the component that’s going to need it.
