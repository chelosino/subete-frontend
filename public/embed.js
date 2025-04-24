(() => {
  const shop = new URLSearchParams(window.location.search).get("shop");
  const iframe = document.createElement("iframe");

  iframe.src = `https://subete-frontend.vercel.app/widget?shop=${shop}`;
  iframe.style = "width: 100%; height: 600px; border: none;";

  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(iframe);
  });
})();
