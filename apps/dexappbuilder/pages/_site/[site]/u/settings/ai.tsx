import { DexkitApiProvider } from '@dexkit/core/providers';
import { useCompletation } from '@dexkit/ui/hooks/ai';
import { Button, Container } from '@mui/material';
import AuthMainLayout from 'src/components/layouts/authMain';
import { myAppsApi } from 'src/services/whitelabel';

export default function AiPage() {
  const completationMutation = useCompletation();

  const handleClick = async () => {
    await completationMutation.mutateAsync({
      messages: [
        { role: 'system', content: 'Hello' },
        { role: 'user', content: 'How are you?' },
      ],
    });
  };

  return (
    <Container>
      {JSON.stringify(completationMutation.data)}
      <Button onClick={handleClick} variant="contained">
        Call
      </Button>
    </Container>
  );
}

(AiPage as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout noSsr>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {page}
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};
