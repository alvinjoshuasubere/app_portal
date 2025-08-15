export default function ({ $axios, redirect }) {
  if (!localStorage.client_id) {
    redirect("/");
  }
}
