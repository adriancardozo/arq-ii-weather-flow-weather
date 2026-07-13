import { NodeSDK } from '@opentelemetry/sdk-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import configuration from '../configuration/configuration';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { useAzureMonitor } from '@azure/monitor-opentelemetry';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { metrics } from '@opentelemetry/api';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

const { app, insights } = configuration();

if (insights.connection_string) useAzureMonitor();

export const exporter = new PrometheusExporter({ preventServerStart: true });

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: app.service_name,
    [ATTR_SERVICE_VERSION]: app.version,
  }),
  traceExporter: new OTLPTraceExporter(),
  metricReader: exporter,
  logRecordProcessors: [new BatchLogRecordProcessor({ exporter: new OTLPLogExporter() })],
  instrumentations: [new HttpInstrumentation()],
});

sdk.start();

const hostMetrics = new HostMetrics({ meterProvider: metrics.getMeterProvider() });

hostMetrics.start();
