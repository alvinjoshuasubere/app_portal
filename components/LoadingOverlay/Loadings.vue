<template>
  <div class="bg">
    <div id="loader" class="loader1">
      <div class="loading">•</div>
    </div>
    <div id="loader" class="loader2">
      <div class="load">•</div>
    </div>
    <div id="loader" class="loader3">
      <div class="logo"></div>
    </div>
    <div id="loader" class="loader4">
      <div class="logoBG"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.loader1,
.loader2,
.loader3,
.loader4 {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-animation-name: fadeIn;
  -webkit-animation-duration: 0.4s;
  animation-name: fadeIn;
  animation-duration: 0.4s;
}
.loader1 {
  z-index: 10002;
}
.loader2 {
  z-index: 10003;
}
.loader3 {
  z-index: 10004;
}
.loader4 {
  z-index: 10003;
}
.bg {
  z-index: 10001;
  position: fixed;
  left: 0;
  top: 0;
  background: #00000080;
  width: 100%;
  height: 100vh;
  animation: fadeIn 0.4s;
}
.loading {
  position: relative;
  width: 160px;
  height: 160px;
}
.loading::before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 6px solid transparent;
  border-top-color: #c7fcec; /* Adjust color to match */
  border-radius: 50%;
  animation: spin 1s linear infinite, gradient 4s ease infinite;
}
.load {
  position: relative;
  width: 120px;
  height: 120px;
}
.load::before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 6px solid transparent;
  border-top-color: #69baa4;
  border-radius: 50%;
  animation: spin .5s linear infinite, gradient 4s ease infinite;
}
.logo {
  background-image: url("/ict_logo.png");
  background-size: cover;
  width: 110px;
  height: 110px;
}
.logoBG {
  width: 103px;
  height: 103px;
  background: transparent;
  background-size: 300% 300%;
  border-radius: 100px;
  animation: gradient 4s ease infinite;
}
.lab {
  margin-top: 200px;
  color: white;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 13px;
}
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
