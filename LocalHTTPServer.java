//#!java --source 11

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class LocalHTTPServer {

    private static final List<String> STATIC_CONTENT = List.of(".html", ".htm", ".css", ".js", ".wasm");
    private static final List<String> RESTRICTED_HEADERS = List.of("connection", "host", "content-length", "origin", "user-agent", "authorization");
    private static final Map<String, List<String>> CORS_HEADERS = Map.of(
            "Access-Control-Allow-Origin", List.of("*"),
            "Access-Control-Allow-Headers", List.of("*"));

    private static final ConcurrentMap<String, String> CONTENT_TYPES_CACHE = new ConcurrentHashMap<>();

    public static void main(String[] args) throws IOException, URISyntaxException {
        HttpServer server = HttpServer.create(new InetSocketAddress(80), 0);
        server.setExecutor(Executors.newCachedThreadPool());
        Executor httpClientExecutor = Executors.newWorkStealingPool();

        var context = server.createContext("/WAGL/", (HttpExchange exchange) -> {

            var contentURI = exchange.getRequestURI().getPath().substring(1);
            var extension = contentURI.contains(".") ? contentURI.substring(contentURI.lastIndexOf(".")) : "";
            var path = (isStaticContent(extension) ? "http://localhost:3000/" : "https://dev.azure.com/") + contentURI;
            var requestMethod = exchange.getRequestMethod();

            System.out.println("path " + path + " method " + exchange.getRequestMethod());

            if (!".ico".equals(extension)) {
                try (var outputStream = exchange.getResponseBody()) {

                    var responseHeaders = exchange.getResponseHeaders();

                    if (requestMethod.equalsIgnoreCase("options")) {
                        CORS_HEADERS.forEach(responseHeaders::put);
                        exchange.sendResponseHeaders(200, -1);
                        outputStream.flush();
                    } else {
                        var response = executeRequest(path, httpClientExecutor, exchange);
                        var body = response.body();
                        var headers = response.headers().map();

                        headers.forEach(responseHeaders::put);
                        CORS_HEADERS.forEach(responseHeaders::put);
                        //responseHeaders.put("Connection", List.of("close"));

                        exchange.sendResponseHeaders(200, 0);
                        outputStream.write(body);
                        outputStream.flush();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                exchange.sendResponseHeaders(404, 0);
                exchange.getResponseBody().flush();
            }

        });
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            server.removeContext(context);
            server.stop(0);
        }));
        server.start();
    }

    private static boolean isStaticContent(String extension) {
        String canonicalExtension = Objects.toString(extension, "");
        return STATIC_CONTENT.contains(canonicalExtension);
    }

    private static HttpResponse<byte[]> executeRequest(
            String uri,
            Executor httpClientExecutor,
            HttpExchange exchange
    ) throws IOException, InterruptedException {

        var cookie = System.getenv("X_COOKIE");
        var method = exchange.getRequestMethod();
        HttpRequest.Builder reqBuilder = HttpRequest.newBuilder(URI.create(uri))
                .timeout(Duration.ofMillis(30000))
                .method(method.toUpperCase(), !method.equalsIgnoreCase("GET") ? HttpRequest.BodyPublishers.ofInputStream(exchange::getRequestBody): HttpRequest.BodyPublishers.noBody())
                .version(HttpClient.Version.HTTP_1_1);

        exchange.getRequestHeaders().forEach((name, value) -> {
            if (RESTRICTED_HEADERS.stream().noneMatch(name::equalsIgnoreCase)) {
                reqBuilder.header(name, String.join("", value));
                System.out.printf("header %s value %s%n", name, value);
            }
        });

        HttpRequest httpRequest = reqBuilder
                .header("Cookie", cookie)
                .build();

        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(15000))
                .executor(httpClientExecutor)
                .build();

        return httpClient
                .send(httpRequest, HttpResponse.BodyHandlers.ofByteArray());
    }

}
