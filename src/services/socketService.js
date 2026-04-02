import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api/axiosClient";

class SocketService {
    socket = null;

    connect(namespace = "", extraQuery = {}) {
        if (this.socket && this.socket.connected) return;

        const token = Cookies.get("access_token");
        if (!token) {
            console.warn("⚠️ [Socket] Connection skipped: No access_token found in cookies.");
            return;
        }

        // Clean the base URL
        let socketUrl = API_BASE_URL.startsWith("http") 
            ? API_BASE_URL 
            : window.location.origin;
        socketUrl = socketUrl.replace(/\/api\/?$/, "");

        // Build full URL with namespace
        const fullUrl = socketUrl + (namespace ? (namespace.startsWith('/') ? namespace : '/' + namespace) : "");

        this.socket = io(fullUrl, {
            auth: {
                token: token
            },
            query: {
                ...extraQuery
            },
            transports: ["websocket", "polling"],
            extraHeaders: {
                "ngrok-skip-browser-warning": "true"
            }
        });

        this.socket.on("connect_error", (err) => {
            console.error("❌ [Socket] Connection Error:", err.message);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    on(event, callback) {
        if (!this.socket) this.connect();
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    emit(event, data) {
        if (!this.socket) this.connect();
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }
}

export const socketService = new SocketService();
