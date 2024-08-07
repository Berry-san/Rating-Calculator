import React, { useState } from 'react'

function roundToNearestHalfOrWhole(num) {
  let roundedHalf = Math.round(num * 2) / 2
  let decimalPart = roundedHalf % 1
  if (decimalPart === 0.5) {
    return roundedHalf
  }
  return Math.round(roundedHalf)
}

function recommendations(load, fullLoadTime, batteryVolt = 12) {
  const totalLoad = Number(load) + 0.25 * Number(load)
  const inverterRating = totalLoad / 0.8
  const totalWattHours = totalLoad * fullLoadTime
  const batteryRating = ((totalWattHours * 1000) / Number(batteryVolt)) * 0.8
  const pvOutputPower = 960
  const noOfPanels = Math.ceil((totalWattHours * 1000) / pvOutputPower)

  console.log(noOfPanels)

  return {
    inverterRating: `${roundToNearestHalfOrWhole(inverterRating)} kVA`,
    batteryRating: `${roundToNearestHalfOrWhole(batteryRating)} Ah`,
    batteryVolt: `${batteryVolt} V`,
    noOfPanels: `${noOfPanels} 200W panels`,
    sentence: `You need an inverter of ${roundToNearestHalfOrWhole(
      inverterRating
    )} kVA, ${batteryVolt / 12} battery(ies) of ${
      batteryVolt / (batteryVolt / 12)
    }V/${roundToNearestHalfOrWhole(
      batteryRating
    )} Ah, and ${noOfPanels} 200W panels with a backup of ${fullLoadTime} hours to power your load of ${load} kW.`,
  }
}

const InputForm = () => {
  const [load, setLoad] = useState('')
  const [fullLoadTime, setFullLoadTime] = useState('')
  const [batteryVolt, setBatteryVolt] = useState(12)
  const [result, setResult] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const recommendationsResult = recommendations(
      load,
      fullLoadTime,
      batteryVolt
    )
    setResult(recommendationsResult)
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md p-10 rounded shadow">
        <h1 className="mb-4 text-2xl font-bold text-center">
          Solar Inverter Rating Calculator
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center space-y-5"
        >
          <div className="flex flex-col text-center">
            <label>Load (kW):</label>
            <input
              type="number"
              value={load}
              onChange={(e) => setLoad(e.target.value)}
              className="px-3 py-2 border rounded border-slate-400"
              required
            />
          </div>
          <div className="flex flex-col text-center">
            <label>Full Load Time (hours):</label>
            <input
              type="number"
              value={fullLoadTime}
              onChange={(e) => setFullLoadTime(e.target.value)}
              className="px-3 py-2 border rounded border-slate-400"
              required
            />
          </div>
          <div className="flex flex-col text-center">
            <label>Battery Voltage (V):</label>
            <input
              type="number"
              value={batteryVolt}
              onChange={(e) => setBatteryVolt(e.target.value)}
              className="px-3 py-2 text-center border rounded border-slate-400"
              required
            />
          </div>
          <div>
            <h2>Note:</h2>
            <ol className="list-disc list-inside">
              <li>The total wattage should be in kilowatts(kW)</li>
              <li>To convert to kilowatts divide total load by 1000ni</li>
              <li>
                A battery is 12 V so if more than one battery is considered the
                12 V should be changed
              </li>
            </ol>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center px-3 py-2 text-center text-white bg-blue-900 rounded"
          >
            Calculate
          </button>
        </form>
        {result && (
          <div>
            <h2>Recommendations:</h2>
            <p>{result.sentence}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InputForm
