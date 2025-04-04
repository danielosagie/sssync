import { RouteContext } from "gadget-server";

export default async function squareCallback(context: RouteContext) {
  const { code, state } = context.request.query;
  
  // Send code back to parent window
  const html = `
    <script>
      if (window.opener) {
        window.opener.postMessage({
          type: 'SQUARE_OAUTH_CALLBACK',
          code: '${code}'
        }, '*');
        window.close();
      } else {
        window.location.href = '/signed-in';
      }
    </script>
  `;
  
  context.response.send(html);
}