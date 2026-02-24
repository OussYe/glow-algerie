import Link from 'next/link'
import Header from '@/components/client/Header'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

type Props = { searchParams: Promise<{ id?: string }> }

export default async function ConfirmationPage({ searchParams }: Props) {
  const { id } = await searchParams
  const shortId = id?.slice(0, 8).toUpperCase()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          <CheckCircleIcon className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-gray-600 mb-2">
            Votre commande a été enregistrée avec succès.
          </p>
          {shortId && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 my-4 inline-block">
              <p className="text-xs text-gray-500">Numéro de commande</p>
              <p className="font-mono font-bold text-lg text-gray-800">#{shortId}</p>
            </div>
          )}
          <p className="text-gray-500 text-sm mb-8">
            Nous vous contacterons bientôt pour confirmer la livraison.
            Merci pour votre confiance !
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-2xl transition"
            >
              Continuer les achats
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
