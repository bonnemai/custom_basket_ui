import { FormEvent, useState } from 'react';
import { Alert, Button, Card, Col, Form, Input, InputNumber, Row, Space, Tag, Typography } from 'antd';
import { useCreateBasket } from './hooks/useCreateBasket';
import { useBasketStream } from './hooks/useBasketStream';
import PositionsGrid from './components/PositionsGrid';
import ExistingBasketsGrid from './components/ExistingBasketsGrid';
import { createInitialRequest } from './utils/defaults';
import type { CreateBasketRequest } from './types/api';

export const cleansePayload = (
  payload: CreateBasketRequest
): CreateBasketRequest => ({
  ...payload,
  positions: payload.positions.map((position) => {
    const metadataEntries = Object.entries(position.metadata ?? {});
    const filteredMetadata = Object.fromEntries(
      metadataEntries.filter(([key]) => key.trim().length > 0)
    );

    return {
      ...position,
      weight: Number(position.weight),
      ...(Object.keys(filteredMetadata).length > 0 ? { metadata: filteredMetadata } : {})
    };
  }),
  notional: Number(Number(payload.notional).toFixed(2))
});

const PRICING_DOCS_URL =
  import.meta.env.VITE_PRICING_API_DOCS_URL ?? 'http://localhost:8000/docs#/';

function App() {
  const [formData, setFormData] = useState(createInitialRequest);
  const { loading, data, error, addBasket } = useCreateBasket();
  const { baskets, asOf, connected, error: streamError } = useBasketStream();

  const { Title, Paragraph, Link, Text } = Typography;

  const handlePrimitiveChange = <K extends keyof CreateBasketRequest>(
    field: K,
    value: CreateBasketRequest[K]
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handlePositionsChange = (
    nextPositions: CreateBasketRequest['positions']
  ) => {
    setFormData((current) => ({
      ...current,
      positions: nextPositions
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = cleansePayload(formData);
    await addBasket(payload);
  };

  const handleReset = () => {
    setFormData(createInitialRequest());
  };

  return (
    <main>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>Custom Basket Builder</Title>
          <Paragraph>
            Configure your basket, review the outgoing JSON payload, and send it to the basket service. Review the{' '}
            <Link href={PRICING_DOCS_URL} target="_blank" rel="noreferrer noopener">
              API documentation
            </Link>{' '}
            for request details.
          </Paragraph>
        </div>

        <Form layout="vertical" onSubmitCapture={handleSubmit}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title="Basket Details">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Basket Name" required>
                    <Input
                      value={formData.basket_name}
                      onChange={(event) => handlePrimitiveChange('basket_name', event.target.value)}
                      required
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Base Currency" required>
                    <Input
                      value={formData.base_currency}
                      onChange={(event) => handlePrimitiveChange('base_currency', event.target.value)}
                      required
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Notional" required>
                    <InputNumber
                      min={0}
                      step={0.01}
                      precision={2}
                      style={{ width: '100%' }}
                      value={formData.notional}
                      onChange={(value) => handlePrimitiveChange('notional', Number(value ?? 0))}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Positions">
              <PositionsGrid positions={formData.positions} onChange={handlePositionsChange} />
            </Card>

            <Card title="Review & Submit">
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Add Basket
                </Button>
                <Button htmlType="button" onClick={handleReset} disabled={loading}>
                  Reset to sample
                </Button>
              </Space>
            </Card>

            <Card
              title="Live Basket Prices"
              extra={<Tag color={connected ? 'green' : 'red'}>{connected ? 'Live' : 'Offline'}</Tag>}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text type="secondary">
                  Latest update: {asOf ? new Date(asOf).toLocaleString() : '—'}
                </Text>
                <ExistingBasketsGrid baskets={baskets} />
              </Space>
            </Card>
          </Space>
        </Form>

        {error && (
          <Alert
            type="error"
            showIcon
            message="Add basket request failed"
            description={error.message}
          />
        )}

        {data && (
          <Card title="Response">
            <pre className="response">{JSON.stringify(data, null, 2)}</pre>
          </Card>
        )}

        {streamError && (
          <Alert type="warning" showIcon message="Basket stream" description={streamError} />
        )}
      </Space>
    </main>
  );
}

export default App;
