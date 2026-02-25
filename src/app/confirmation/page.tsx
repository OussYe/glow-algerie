import Header from '@/components/client/Header'
import ConfirmationContent from '@/components/client/ConfirmationContent'

type Props = { searchParams: Promise<{ id?: string }> }

export default async function ConfirmationPage({ searchParams }: Props) {
  const { id } = await searchParams
  const shortId = id?.slice(0, 8).toUpperCase()

  return (
    <div className="min-h-screen">
      <Header />
      <ConfirmationContent shortId={shortId} />
    </div>
  )
}
