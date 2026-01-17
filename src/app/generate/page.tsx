import { GeneratorClient } from './generator-client';

// Force dynamic rendering (requires auth)
export const dynamic = 'force-dynamic';

export default function GeneratePage() {
  return <GeneratorClient />;
}
