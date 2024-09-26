import RecurringDatePicker from '../components/RecurringDatePicker'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 shadow-text">
          Recurring Date Picker
        </h1>
        <RecurringDatePicker />
      </div>
    </div>
  )
}