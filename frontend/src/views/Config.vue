<template>
  <pre class="config">
    <h1 class="title">Config</h1>
{{JSON.stringify(config, null, ' ')}}
  </pre>
</template>
<script>
import config from '@/config';

export default {
  data() {
    return {
      config,
    };
  },
};
</script>
<style scoped>
.config {
  text-align: left;
  width: fit-content;
  margin: auto;
}
</style>
