// export default function ({ route, redirect }) {
//   const userRole = localStorage.role;
//   const routesWithRoles = [
//     {
//       path: "/dashboard",
//       roles: ["TECHNICIAN", "DISPATCH"],
//     },
//     {
//       path: "/request",
//       roles: ["TECHNICIAN", "DISPATCH"],
//     },
//     {
//       path: "/dispatcher",
//       roles: ["DISPATCH"],
//     },
//     {
//       path: "/reports",
//       roles: ["TECHNICIAN", "DISPATCH"],
//     },
//   ];

//   if (!userRole) {
//     return redirect('/');
//   }

//   const matchedRoute = routesWithRoles.find(r => r.path === route.path);

//   if (matchedRoute && !matchedRoute.roles.includes(userRole)) {
//     return redirect('/login');
//   }
// }
