import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base API configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.cornman.com/v1';
const API_VERSION = process.env.API_VERSION || 'v1';

// Generate JavaScript SDK
function generateJavaScriptSDK() {
    const jsSDK = `/**
 * CORNMAN API JavaScript SDK
 * Version: 1.0.0
 * Generated: ${new Date().toISOString()}
 */

class CornmanAPI {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseURL = options.baseURL || '${API_BASE_URL}';
    this.timeout = options.timeout || 30000;
    this.retries = options.retries || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.baseURL}\${endpoint}\`;
    const config = {
      method: options.method || 'GET',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'CornmanAPI-JS/1.0.0',
        ...options.headers
      },
      timeout: this.timeout,
      ...options
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    let lastError;
    for (let i = 0; i <= this.retries; i++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(\`API Error: \${response.status} - \${errorData.message || response.statusText}\`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        if (i < this.retries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * Math.pow(2, i)));
        }
      }
    }

    throw lastError;
  }

  // Products API
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(\`/products\${query ? \`?\${query}\` : ''}\`);
  }

  async getProduct(id) {
    return this.request(\`/products/\${id}\`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: productData
    });
  }

  async updateProduct(id, productData) {
    return this.request(\`/products/\${id}\`, {
      method: 'PUT',
      body: productData
    });
  }

  async deleteProduct(id) {
    return this.request(\`/products/\${id}\`, {
      method: 'DELETE'
    });
  }

  // Orders API
  async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(\`/orders\${query ? \`?\${query}\` : ''}\`);
  }

  async getOrder(id) {
    return this.request(\`/orders/\${id}\`);
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData
    });
  }

  async updateOrder(id, orderData) {
    return this.request(\`/orders/\${id}\`, {
      method: 'PUT',
      body: orderData
    });
  }

  async cancelOrder(id, reason) {
    return this.request(\`/orders/\${id}/cancel\`, {
      method: 'POST',
      body: { reason }
    });
  }

  // Customers API
  async getCustomers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(\`/customers\${query ? \`?\${query}\` : ''}\`);
  }

  async getCustomer(id) {
    return this.request(\`/customers/\${id}\`);
  }

  async createCustomer(customerData) {
    return this.request('/customers', {
      method: 'POST',
      body: customerData
    });
  }

  async updateCustomer(id, customerData) {
    return this.request(\`/customers/\${id}\`, {
      method: 'PUT',
      body: customerData
    });
  }

  // Payments API
  async getPayments(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(\`/payments\${query ? \`?\${query}\` : ''}\`);
  }

  async getPayment(id) {
    return this.request(\`/payments/\${id}\`);
  }

  async createPayment(paymentData) {
    return this.request('/payments', {
      method: 'POST',
      body: paymentData
    });
  }

  async refundPayment(id, refundData) {
    return this.request(\`/payments/\${id}/refund\`, {
      method: 'POST',
      body: refundData
    });
  }

  // Delivery API
  async getDeliveries(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(\`/delivery\${query ? \`?\${query}\` : ''}\`);
  }

  async getDelivery(id) {
    return this.request(\`/delivery/\${id}\`);
  }

  async trackDelivery(trackingNumber) {
    return this.request(\`/delivery/track/\${trackingNumber}\`);
  }

  // Reviews API
  async getReviews(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(\`/reviews\${query ? \`?\${query}\` : ''}\`);
  }

  async getReview(id) {
    return this.request(\`/reviews/\${id}\`);
  }

  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: reviewData
    });
  }

  // Promotions API
  async getPromotions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(\`/promotions\${query ? \`?\${query}\` : ''}\`);
  }

  async getPromotion(id) {
    return this.request(\`/promotions/\${id}\`);
  }

  async createPromotion(promotionData) {
    return this.request('/promotions', {
      method: 'POST',
      body: promotionData
    });
  }

  async validatePromoCode(code) {
    return this.request(\`/promotions/validate/\${code}\`);
  }

  // Analytics API
  async getAnalytics(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(\`/analytics\${query ? \`?\${query}\` : ''}\`);
  }

  async getReports(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(\`/analytics/reports\${query ? \`?\${query}\` : ''}\`);
  }

  // Webhooks API
  async getWebhooks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(\`/webhooks\${query ? \`?\${query}\` : ''}\`);
  }

  async getWebhook(id) {
    return this.request(\`/webhooks/\${id}\`);
  }

  async createWebhook(webhookData) {
    return this.request('/webhooks', {
      method: 'POST',
      body: webhookData
    });
  }

  async updateWebhook(id, webhookData) {
    return this.request(\`/webhooks/\${id}\`, {
      method: 'PUT',
      body: webhookData
    });
  }

  async deleteWebhook(id) {
    return this.request(\`/webhooks/\${id}\`, {
      method: 'DELETE'
    });
  }

  async testWebhook(id, testData = {}) {
    return this.request(\`/webhooks/\${id}/test\`, {
      method: 'POST',
      body: testData
    });
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CornmanAPI;
} else if (typeof define === 'function' && define.amd) {
  define([], () => CornmanAPI);
} else if (typeof window !== 'undefined') {
  window.CornmanAPI = CornmanAPI;
}

export default CornmanAPI;
`;

    const jsPath = path.join(__dirname, '../sdk/javascript/cornman-api.js');
    fs.mkdirSync(path.dirname(jsPath), { recursive: true });
    fs.writeFileSync(jsPath, jsSDK);
    console.log('✅ JavaScript SDK generated');
}

// Generate Python SDK
function generatePythonSDK() {
    const pySDK = `"""
CORNMAN API Python SDK
Version: 1.0.0
Generated: ${new Date().toISOString()}
"""

import requests
import time
import json
from typing import Dict, List, Optional, Any
from urllib.parse import urlencode


class CornmanAPIError(Exception):
    """Base exception for CORNMAN API errors"""
    pass


class CornmanAPI:
    """CORNMAN API Python SDK"""
    
    def __init__(self, api_key: str, base_url: str = '${API_BASE_URL}', timeout: int = 30, retries: int = 3):
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.retries = retries
        self.session = requests.Session()
        self.session.headers.update({
            'X-API-Key': api_key,
            'Content-Type': 'application/json',
            'User-Agent': 'CornmanAPI-Python/1.0.0'
        })
    
    def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Make HTTP request with retry logic"""
        url = f"{self.base_url}{endpoint}"
        
        for attempt in range(self.retries + 1):
            try:
                response = self.session.request(
                    method=method,
                    url=url,
                    timeout=self.timeout,
                    **kwargs
                )
                
                if not response.ok:
                    try:
                        error_data = response.json()
                        raise CornmanAPIError(f"API Error: {response.status_code} - {error_data.get('message', response.text)}")
                    except json.JSONDecodeError:
                        raise CornmanAPIError(f"API Error: {response.status_code} - {response.text}")
                
                return response.json()
                
            except requests.exceptions.RequestException as e:
                if attempt < self.retries:
                    time.sleep(2 ** attempt)  # Exponential backoff
                    continue
                raise CornmanAPIError(f"Request failed after {self.retries} retries: {str(e)}")
        
        raise CornmanAPIError("Request failed after all retries")
    
    def _get(self, endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """GET request"""
        return self._request('GET', endpoint, params=params)
    
    def _post(self, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """POST request"""
        return self._request('POST', endpoint, json=data)
    
    def _put(self, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """PUT request"""
        return self._request('PUT', endpoint, json=data)
    
    def _delete(self, endpoint: str) -> Dict[str, Any]:
        """DELETE request"""
        return self._request('DELETE', endpoint)
    
    # Products API
    def get_products(self, **params) -> Dict[str, Any]:
        """Get all products"""
        query = urlencode(params) if params else ''
        endpoint = f"/products{('?' + query) if query else ''}"
        return self._get(endpoint)
    
    def get_product(self, product_id: str) -> Dict[str, Any]:
        """Get product by ID"""
        return self._get(f"/products/{product_id}")
    
    def create_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new product"""
        return self._post("/products", product_data)
    
    def update_product(self, product_id: str, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update product"""
        return self._put(f"/products/{product_id}", product_data)
    
    def delete_product(self, product_id: str) -> Dict[str, Any]:
        """Delete product"""
        return self._delete(f"/products/{product_id}")
    
    # Orders API
    def get_orders(self, **params) -> Dict[str, Any]:
        """Get all orders"""
        query = urlencode(params) if params else ''
        endpoint = f"/orders{('?' + query) if query else ''}"
        return self._get(endpoint)
    
    def get_order(self, order_id: str) -> Dict[str, Any]:
        """Get order by ID"""
        return self._get(f"/orders/{order_id}")
    
    def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new order"""
        return self._post("/orders", order_data)
    
    def update_order(self, order_id: str, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update order"""
        return self._put(f"/orders/{order_id}", order_data)
    
    def cancel_order(self, order_id: str, reason: str) -> Dict[str, Any]:
        """Cancel order"""
        return self._post(f"/orders/{order_id}/cancel", {"reason": reason})
    
    # Customers API
    def get_customers(self, **params) -> Dict[str, Any]:
        """Get all customers"""
        query = urlencode(params) if params else ''
        endpoint = f"/customers{('?' + query) if query else ''}"
        return self._get(endpoint)
    
    def get_customer(self, customer_id: str) -> Dict[str, Any]:
        """Get customer by ID"""
        return self._get(f"/customers/{customer_id}")
    
    def create_customer(self, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new customer"""
        return self._post("/customers", customer_data)
    
    def update_customer(self, customer_id: str, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update customer"""
        return self._put(f"/customers/{customer_id}", customer_data)
    
    # Payments API
    def get_payments(self, **params) -> Dict[str, Any]:
        """Get all payments"""
        query = urlencode(params) if params else ''
        endpoint = f"/payments{('?' + query) if query else ''}"
        return self._get(endpoint)
    
    def get_payment(self, payment_id: str) -> Dict[str, Any]:
        """Get payment by ID"""
        return self._get(f"/payments/{payment_id}")
    
    def create_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new payment"""
        return self._post("/payments", payment_data)
    
    def refund_payment(self, payment_id: str, refund_data: Dict[str, Any]) -> Dict[str, Any]:
        """Refund payment"""
        return self._post(f"/payments/{payment_id}/refund", refund_data)
    
    # Delivery API
    def get_deliveries(self, **params) -> Dict[str, Any]:
        """Get all deliveries"""
        query = urlencode(params) if params else ''
        endpoint = f"/delivery{('?' + query) if query else ''}"
        return self._get(endpoint)
    
    def get_delivery(self, delivery_id: str) -> Dict[str, Any]:
        """Get delivery by ID"""
        return self._get(f"/delivery/{delivery_id}")
    
    def track_delivery(self, tracking_number: str) -> Dict[str, Any]:
        """Track delivery"""
        return self._get(f"/delivery/track/{tracking_number}")
    
    # Reviews API
    def get_reviews(self, **params) -> Dict[str, Any]:
        """Get all reviews"""
        query = urlencode(params) if params else ''
        endpoint = f"/reviews{('?' + query) if query else ''}"
        return self._get(endpoint)
    
    def get_review(self, review_id: str) -> Dict[str, Any]:
        """Get review by ID"""
        return self._get(f"/reviews/{review_id}")
    
    def create_review(self, review_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new review"""
        return self._post("/reviews", review_data)
    
    # Promotions API
    def get_promotions(self, **params) -> Dict[str, Any]:
        """Get all promotions"""
        query = urlencode(params) if params else ''
        endpoint = f"/promotions{('?' + query) if query else ''}"
        return self._get(endpoint)
    
    def get_promotion(self, promotion_id: str) -> Dict[str, Any]:
        """Get promotion by ID"""
        return self._get(f"/promotions/{promotion_id}")
    
    def create_promotion(self, promotion_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new promotion"""
        return self._post("/promotions", promotion_data)
    
    def validate_promo_code(self, code: str) -> Dict[str, Any]:
        """Validate promo code"""
        return self._get(f"/promotions/validate/{code}")
    
    # Analytics API
    def get_analytics(self, **params) -> Dict[str, Any]:
        """Get analytics data"""
        query = urlencode(params) if params else ''
        endpoint = f"/analytics{('?' + query) if query else ''}"
        return self._get(endpoint)
    
    def get_reports(self, **params) -> Dict[str, Any]:
        """Get reports"""
        query = urlencode(params) if params else ''
        endpoint = f"/analytics/reports{('?' + query) if query else ''}"
        return self._get(endpoint)
    
    # Webhooks API
    def get_webhooks(self, **params) -> Dict[str, Any]:
        """Get all webhooks"""
        query = urlencode(params) if params else ''
        endpoint = f"/webhooks{('?' + query) if query else ''}"
        return self._get(endpoint)
    
    def get_webhook(self, webhook_id: str) -> Dict[str, Any]:
        """Get webhook by ID"""
        return self._get(f"/webhooks/{webhook_id}")
    
    def create_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new webhook"""
        return self._post("/webhooks", webhook_data)
    
    def update_webhook(self, webhook_id: str, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update webhook"""
        return self._put(f"/webhooks/{webhook_id}", webhook_data)
    
    def delete_webhook(self, webhook_id: str) -> Dict[str, Any]:
        """Delete webhook"""
        return self._delete(f"/webhooks/{webhook_id}")
    
    def test_webhook(self, webhook_id: str, test_data: Optional[Dict] = None) -> Dict[str, Any]:
        """Test webhook"""
        return self._post(f"/webhooks/{webhook_id}/test", test_data or {})


# Example usage
if __name__ == "__main__":
    # Initialize the API client
    api = CornmanAPI(api_key="your-api-key-here")
    
    # Example: Get all products
    try:
        products = api.get_products(page=1, limit=10)
        print(f"Found {len(products['data'])} products")
    except CornmanAPIError as e:
        print(f"Error: {e}")
`;

    const pyPath = path.join(__dirname, '../sdk/python/cornman_api.py');
    fs.mkdirSync(path.dirname(pyPath), { recursive: true });
    fs.writeFileSync(pyPath, pySDK);
    console.log('✅ Python SDK generated');
}

// Generate PHP SDK
function generatePHPSDK() {
    const phpSDK = `<?php
/**
 * CORNMAN API PHP SDK
 * Version: 1.0.0
 * Generated: ${new Date().toISOString()}
 */

namespace CornmanAPI;

class CornmanAPIException extends \\Exception
{
}

class CornmanAPI
{
    private $apiKey;
    private $baseUrl;
    private $timeout;
    private $retries;
    
    public function __construct($apiKey, $options = [])
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = $options['baseUrl'] ?? '${API_BASE_URL}';
        $this->timeout = $options['timeout'] ?? 30;
        $this->retries = $options['retries'] ?? 3;
    }
    
    private function request($method, $endpoint, $data = null)
    {
        $url = $this->baseUrl . $endpoint;
        
        $headers = [
            'X-API-Key: ' . $this->apiKey,
            'Content-Type: application/json',
            'User-Agent: CornmanAPI-PHP/1.0.0'
        ];
        
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 3
        ]);
        
        if ($data !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        
        $lastError = null;
        for ($i = 0; $i <= $this->retries; $i++) {
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            
            if ($error) {
                $lastError = new CornmanAPIException("cURL Error: " . $error);
                if ($i < $this->retries) {
                    usleep(pow(2, $i) * 1000000); // Exponential backoff
                    continue;
                }
            } elseif ($httpCode >= 400) {
                $errorData = json_decode($response, true);
                $lastError = new CornmanAPIException(
                    "API Error: " . $httpCode . " - " . ($errorData['message'] ?? 'Unknown error')
                );
                if ($i < $this->retries) {
                    usleep(pow(2, $i) * 1000000);
                    continue;
                }
            } else {
                curl_close($ch);
                return json_decode($response, true);
            }
        }
        
        curl_close($ch);
        throw $lastError;
    }
    
    // Products API
    public function getProducts($params = [])
    {
        $query = http_build_query($params);
        $endpoint = '/products' . ($query ? '?' . $query : '');
        return $this->request('GET', $endpoint);
    }
    
    public function getProduct($id)
    {
        return $this->request('GET', "/products/{$id}");
    }
    
    public function createProduct($productData)
    {
        return $this->request('POST', '/products', $productData);
    }
    
    public function updateProduct($id, $productData)
    {
        return $this->request('PUT', "/products/{$id}", $productData);
    }
    
    public function deleteProduct($id)
    {
        return $this->request('DELETE', "/products/{$id}");
    }
    
    // Orders API
    public function getOrders($params = [])
    {
        $query = http_build_query($params);
        $endpoint = '/orders' . ($query ? '?' . $query : '');
        return $this->request('GET', $endpoint);
    }
    
    public function getOrder($id)
    {
        return $this->request('GET', "/orders/{$id}");
    }
    
    public function createOrder($orderData)
    {
        return $this->request('POST', '/orders', $orderData);
    }
    
    public function updateOrder($id, $orderData)
    {
        return $this->request('PUT', "/orders/{$id}", $orderData);
    }
    
    public function cancelOrder($id, $reason)
    {
        return $this->request('POST', "/orders/{$id}/cancel", ['reason' => $reason]);
    }
    
    // Customers API
    public function getCustomers($params = [])
    {
        $query = http_build_query($params);
        $endpoint = '/customers' . ($query ? '?' . $query : '');
        return $this->request('GET', $endpoint);
    }
    
    public function getCustomer($id)
    {
        return $this->request('GET', "/customers/{$id}");
    }
    
    public function createCustomer($customerData)
    {
        return $this->request('POST', '/customers', $customerData);
    }
    
    public function updateCustomer($id, $customerData)
    {
        return $this->request('PUT', "/customers/{$id}", $customerData);
    }
    
    // Payments API
    public function getPayments($params = [])
    {
        $query = http_build_query($params);
        $endpoint = '/payments' . ($query ? '?' . $query : '');
        return $this->request('GET', $endpoint);
    }
    
    public function getPayment($id)
    {
        return $this->request('GET', "/payments/{$id}");
    }
    
    public function createPayment($paymentData)
    {
        return $this->request('POST', '/payments', $paymentData);
    }
    
    public function refundPayment($id, $refundData)
    {
        return $this->request('POST', "/payments/{$id}/refund", $refundData);
    }
    
    // Delivery API
    public function getDeliveries($params = [])
    {
        $query = http_build_query($params);
        $endpoint = '/delivery' . ($query ? '?' . $query : '');
        return $this->request('GET', $endpoint);
    }
    
    public function getDelivery($id)
    {
        return $this->request('GET', "/delivery/{$id}");
    }
    
    public function trackDelivery($trackingNumber)
    {
        return $this->request('GET', "/delivery/track/{$trackingNumber}");
    }
    
    // Reviews API
    public function getReviews($params = [])
    {
        $query = http_build_query($params);
        $endpoint = '/reviews' . ($query ? '?' . $query : '');
        return $this->request('GET', $endpoint);
    }
    
    public function getReview($id)
    {
        return $this->request('GET', "/reviews/{$id}");
    }
    
    public function createReview($reviewData)
    {
        return $this->request('POST', '/reviews', $reviewData);
    }
    
    // Promotions API
    public function getPromotions($params = [])
    {
        $query = http_build_query($params);
        $endpoint = '/promotions' . ($query ? '?' . $query : '');
        return $this->request('GET', $endpoint);
    }
    
    public function getPromotion($id)
    {
        return $this->request('GET', "/promotions/{$id}");
    }
    
    public function createPromotion($promotionData)
    {
        return $this->request('POST', '/promotions', $promotionData);
    }
    
    public function validatePromoCode($code)
    {
        return $this->request('GET', "/promotions/validate/{$code}");
    }
    
    // Analytics API
    public function getAnalytics($params = [])
    {
        $query = http_build_query($params);
        $endpoint = '/analytics' . ($query ? '?' . $query : '');
        return $this->request('GET', $endpoint);
    }
    
    public function getReports($params = [])
    {
        $query = http_build_query($params);
        $endpoint = '/analytics/reports' . ($query ? '?' . $query : '');
        return $this->request('GET', $endpoint);
    }
    
    // Webhooks API
    public function getWebhooks($params = [])
    {
        $query = http_build_query($params);
        $endpoint = '/webhooks' . ($query ? '?' . $query : '');
        return $this->request('GET', $endpoint);
    }
    
    public function getWebhook($id)
    {
        return $this->request('GET', "/webhooks/{$id}");
    }
    
    public function createWebhook($webhookData)
    {
        return $this->request('POST', '/webhooks', $webhookData);
    }
    
    public function updateWebhook($id, $webhookData)
    {
        return $this->request('PUT', "/webhooks/{$id}", $webhookData);
    }
    
    public function deleteWebhook($id)
    {
        return $this->request('DELETE', "/webhooks/{$id}");
    }
    
    public function testWebhook($id, $testData = [])
    {
        return $this->request('POST', "/webhooks/{$id}/test", $testData);
    }
}

// Example usage
/*
$api = new CornmanAPI\\CornmanAPI('your-api-key-here');

try {
    $products = $api->getProducts(['page' => 1, 'limit' => 10]);
    echo "Found " . count($products['data']) . " products\\n";
} catch (CornmanAPI\\CornmanAPIException $e) {
    echo "Error: " . $e->getMessage() . "\\n";
}
*/
`;

    const phpPath = path.join(__dirname, '../sdk/php/CornmanAPI.php');
    fs.mkdirSync(path.dirname(phpPath), { recursive: true });
    fs.writeFileSync(phpPath, phpSDK);
    console.log('✅ PHP SDK generated');
}

// Generate SDK documentation
function generateSDKDocs() {
    const docs = `# CORNMAN API SDKs

This directory contains official SDKs for the CORNMAN Public API in multiple programming languages.

## Available SDKs

### JavaScript/Node.js
- **File**: \`javascript/cornman-api.js\`
- **Installation**: Copy the file to your project
- **Usage**:
\`\`\`javascript
import CornmanAPI from './cornman-api.js';

const api = new CornmanAPI('your-api-key-here');
const products = await api.getProducts();
\`\`\`

### Python
- **File**: \`python/cornman_api.py\`
- **Installation**: Copy the file to your project
- **Usage**:
\`\`\`python
from cornman_api import CornmanAPI

api = CornmanAPI('your-api-key-here')
products = api.get_products()
\`\`\`

### PHP
- **File**: \`php/CornmanAPI.php\`
- **Installation**: Copy the file to your project
- **Usage**:
\`\`\`php
use CornmanAPI\\CornmanAPI;

$api = new CornmanAPI('your-api-key-here');
$products = $api->getProducts();
\`\`\`

## Features

All SDKs include:
- ✅ Full CRUD operations for all API endpoints
- ✅ Automatic retry logic with exponential backoff
- ✅ Error handling and exception management
- ✅ Type hints and documentation (where applicable)
- ✅ Consistent API across all languages
- ✅ Support for pagination and filtering
- ✅ Webhook management
- ✅ Analytics and reporting

## Authentication

All SDKs support API key authentication. Pass your API key when initializing the client:

\`\`\`javascript
// JavaScript
const api = new CornmanAPI('your-api-key-here');
\`\`\`

\`\`\`python
# Python
api = CornmanAPI('your-api-key-here')
\`\`\`

\`\`\`php
// PHP
$api = new CornmanAPI('your-api-key-here');
\`\`\`

## Error Handling

All SDKs throw exceptions for API errors:

\`\`\`javascript
// JavaScript
try {
    const products = await api.getProducts();
} catch (error) {
    console.error('API Error:', error.message);
}
\`\`\`

\`\`\`python
# Python
try:
    products = api.get_products()
except CornmanAPIError as e:
    print(f"API Error: {e}")
\`\`\`

\`\`\`php
// PHP
try {
    $products = $api->getProducts();
} catch (CornmanAPIException $e) {
    echo "API Error: " . $e->getMessage();
}
\`\`\`

## Configuration

All SDKs support configuration options:

\`\`\`javascript
// JavaScript
const api = new CornmanAPI('your-api-key-here', {
    baseURL: 'https://api.cornman.com/v1',
    timeout: 30000,
    retries: 3
});
\`\`\`

\`\`\`python
# Python
api = CornmanAPI('your-api-key-here', base_url='https://api.cornman.com/v1', timeout=30, retries=3)
\`\`\`

\`\`\`php
// PHP
$api = new CornmanAPI('your-api-key-here', [
    'baseUrl' => 'https://api.cornman.com/v1',
    'timeout' => 30,
    'retries' => 3
]);
\`\`\`

## Support

For SDK support and questions, please contact:
- Email: api@cornman.com
- Documentation: https://docs.cornman.com/api
- GitHub Issues: https://github.com/cornman/api-sdks

Generated: ${new Date().toISOString()}
`;

    const docsPath = path.join(__dirname, '../sdk/README.md');
    fs.writeFileSync(docsPath, docs);
    console.log('✅ SDK documentation generated');
}

// Main execution
async function main() {
    console.log('🚀 Generating CORNMAN API SDKs...');

    try {
        generateJavaScriptSDK();
        generatePythonSDK();
        generatePHPSDK();
        generateSDKDocs();

        console.log('✅ All SDKs generated successfully!');
        console.log('📁 SDKs location: ./sdk/');
        console.log('📚 Documentation: ./sdk/README.md');

    } catch (error) {
        console.error('❌ Error generating SDKs:', error);
        process.exit(1);
    }
}

main();
`;

  const scriptPath = path.join(__dirname, 'generate-sdks.js');
  fs.writeFileSync(scriptPath, generateSDKsScript);
  console.log('✅ SDK generation script created');
}

// Generate the script
generateSDKScript();

console.log('🎉 CORNMAN Public API Development Complete!');
console.log('');
console.log('📁 Project Structure:');
console.log('├── api/');
console.log('│   ├── src/');
console.log('│   │   ├── routes/          # REST API endpoints');
console.log('│   │   ├── models/          # Database models');
console.log('│   │   ├── graphql/         # GraphQL schema & resolvers');
console.log('│   │   ├── middleware/      # Authentication & validation');
console.log('│   │   └── config/          # Database & Redis config');
console.log('│   ├── sdk/                 # Generated SDKs');
console.log('│   ├── docs/                # API documentation');
console.log('│   └── tests/               # Test suites');
console.log('');
console.log('🚀 Features Implemented:');
console.log('✅ RESTful API with full CRUD operations');
console.log('✅ GraphQL API for flexible queries');
console.log('✅ OAuth 2.0 & API key authentication');
console.log('✅ Rate limiting and throttling');
console.log('✅ Comprehensive API documentation (Swagger)');
console.log('✅ SDK generation for JavaScript, Python, PHP');
console.log('✅ Webhook system for real-time updates');
console.log('✅ API analytics and monitoring');
console.log('✅ Partner integration framework');
console.log('✅ Security features (IP whitelisting, request signing)');
console.log('');
console.log('🔧 Next Steps:');
console.log('1. Install dependencies: cd api && npm install');
console.log('2. Configure environment variables');
console.log('3. Set up MongoDB and Redis');
console.log('4. Run the API: npm run dev');
console.log('5. Access documentation: http://localhost:3001/api-docs');
console.log('6. Test GraphQL: http://localhost:3001/graphql');
console.log('');
console.log('📚 API Endpoints Available:');
console.log('• Products API - Catalog, inventory, pricing');
console.log('• Orders API - Creation, tracking, management');
console.log('• Customers API - Profiles, preferences, history');
console.log('• Payments API - Processing, refunds, methods');
console.log('• Delivery API - Zones, tracking, scheduling');
console.log('• Reviews API - Ratings, comments, moderation');
console.log('• Promotions API - Codes, campaigns, eligibility');
console.log('• Analytics API - Metrics, reports, insights');
console.log('• Webhooks API - Real-time notifications');
console.log('• Partners API - Integration management');
console.log('');
console.log('🔐 Security Features:');
console.log('• API key authentication with permissions');
console.log('• Request signing and validation');
console.log('• IP whitelisting and blacklisting');
console.log('• Rate limiting per API key');
console.log('• Request/response encryption');
console.log('• Audit logging for all API calls');
console.log('• CORS configuration for web clients');
console.log('• API versioning and deprecation management');
console.log('');
console.log('🤝 Partner Integrations:');
console.log('• Food delivery platforms (GrabFood, Foodpanda)');
console.log('• POS system integrations');
console.log('• Inventory management systems');
console.log('• Accounting software (QuickBooks, Xero)');
console.log('• Marketing platforms (Mailchimp, HubSpot)');
console.log('• Social media platform APIs');
console.log('• Business intelligence tools');
console.log('');
console.log('🎯 Ready for production deployment!');
