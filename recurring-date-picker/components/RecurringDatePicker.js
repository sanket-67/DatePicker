'use client'
import '../styles/globals.css'
import { useState } from 'react'
import { Calendar } from "./ui/calendar"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useDateStore } from '../lib/store'
import { PreviewCalendar } from './PreviewCalendar'

export default function RecurringDatePicker() {
  const { startDate, endDate, recurrenceType, interval, selectedDays, setStartDate, setEndDate, setRecurrenceType, setInterval, toggleDay } = useDateStore()
  const [showEndDate, setShowEndDate] = useState(false)

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">Recurring Date Picker</h2>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <Label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</Label>
            <div className="bg-white rounded-md shadow-sm">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="rounded-md border"
              />
            </div>
          </div>
          {showEndDate && (
            <div className="flex-1">
              <Label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">End Date</Label>
              <div className="bg-white rounded-md shadow-sm">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  className="rounded-md border"
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <Button 
            onClick={() => setShowEndDate(!showEndDate)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            {showEndDate ? 'Remove End Date' : 'Add End Date'}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recurrence-type" className="block text-sm font-medium text-gray-700 mb-1">Recurrence Type</Label>
            <Select onValueChange={(value) => setRecurrenceType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select recurrence type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="interval" className="block text-sm font-medium text-gray-700 mb-1">Every</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                id="interval"
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value))}
                min={1}
                className="w-20"
              />
              <span className="text-gray-700">{recurrenceType === 'daily' ? 'days' : recurrenceType === 'weekly' ? 'weeks' : recurrenceType === 'monthly' ? 'months' : 'years'}</span>
            </div>
          </div>
        </div>
        {recurrenceType === 'weekly' && (
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Repeat on</Label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day, index) => (
                <Button
                  key={day}
                  variant={selectedDays.includes(index) ? 'default' : 'outline'}
                  onClick={() => toggleDay(index)}
                  className={`w-12 h-12 rounded-full ${
                    selectedDays.includes(index)
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } transition-colors duration-300`}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2 text-indigo-800">Preview</h3>
          <div className="bg-white rounded-md shadow-sm p-4">
            <PreviewCalendar />
          </div>
        </div>
      </div>
    </div>
  )
}