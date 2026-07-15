import { OTLPLogExporter as GrpcOTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { OTLPMetricExporter as GrpcOTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter as GrpcOTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPLogExporter as HttpOTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPMetricExporter as HttpOTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter as HttpOTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPLogExporter as ProtoOTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';
import { OTLPMetricExporter as ProtoOTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { OTLPTraceExporter as ProtoOTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import configuration from '../configuration/configuration';
import { BatchSpanProcessor, SpanProcessor } from '@opentelemetry/sdk-trace-node';
import { IMetricReader, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchLogRecordProcessor, LogRecordProcessor } from '@opentelemetry/sdk-logs';
import {
  AzureMonitorLogExporter,
  AzureMonitorMetricExporter,
  AzureMonitorTraceExporter,
} from '@azure/monitor-opentelemetry-exporter';

const { open_telemetry } = configuration();

const { OTLPTraceExporter, OTLPLogExporter, OTLPMetricExporter } = {
  proto: {
    OTLPTraceExporter: ProtoOTLPTraceExporter,
    OTLPLogExporter: ProtoOTLPLogExporter,
    OTLPMetricExporter: ProtoOTLPMetricExporter,
  },
  http: {
    OTLPTraceExporter: HttpOTLPTraceExporter,
    OTLPLogExporter: HttpOTLPLogExporter,
    OTLPMetricExporter: HttpOTLPMetricExporter,
  },
  grpc: {
    OTLPTraceExporter: GrpcOTLPTraceExporter,
    OTLPLogExporter: GrpcOTLPLogExporter,
    OTLPMetricExporter: GrpcOTLPMetricExporter,
  },
}[open_telemetry.protocol]!;

export function defaults() {
  const spanProcessors: Array<SpanProcessor> = [];
  const metricReaders: Array<IMetricReader> = [];
  const logRecordProcessors: Array<LogRecordProcessor> = [];
  spanProcessors.push(new BatchSpanProcessor(new OTLPTraceExporter()));
  metricReaders.push(new PeriodicExportingMetricReader({ exporter: new OTLPMetricExporter() }));
  logRecordProcessors.push(new BatchLogRecordProcessor({ exporter: new OTLPLogExporter() }));
  return { spanProcessors, metricReaders, logRecordProcessors };
}

export function defaultsWithAzureMonitor() {
  const { spanProcessors, metricReaders, logRecordProcessors } = defaults();
  const traceExporter = new AzureMonitorTraceExporter();
  const metricExporter = new AzureMonitorMetricExporter();
  const logExporter = new AzureMonitorLogExporter();
  spanProcessors.push(new BatchSpanProcessor(traceExporter));
  metricReaders.push(new PeriodicExportingMetricReader({ exporter: metricExporter }));
  logRecordProcessors.push(new BatchLogRecordProcessor({ exporter: logExporter }));
  return { spanProcessors, metricReaders, logRecordProcessors };
}
