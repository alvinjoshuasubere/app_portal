export default function ({ $axios, redirect }) {
  $axios.onError((error) => {
    if (error.response.status === 403) {
      redirect("/");
    }
  });
  if (!localStorage.id) {
    redirect("/"); 
  } else if (!localStorage.token) {
    redirect("/"); 
  }
}
