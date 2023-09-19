import React, { useState } from 'react';
// import './InstallmentForm.css'
// import './style.css';
// import './newcss.css';

const InstallmentForm = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [regularInstallmentData, setRegularInstallmentData] = useState({
    birthday: '',
    interest: '',
    withholdingTax: '',
    amount: '',
    frequency: '',
  });
  const [lumpSumInstallmentData, setLumpSumInstallmentData] = useState({
    birthday: '',
    interest: '',
    withholdingTax: '',
    amount: '',
    lumpSumAmount: '',
  });

  const [yearsUntil18Regular, setYearsUntil18Regular] = useState(null);
  const [yearsUntil18LumpSum, setYearsUntil18LumpSum] = useState(null);
  const [calculatedRegularResult, setCalculatedRegularResult] = useState(null);
  const [calculatedLumpSumResult, setCalculatedLumpSumResult] = useState(null);
  const [nRegular, setNRegular] = useState(null);
  const [nLumpSum, setNLumpSum] = useState(null);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleRegularInputChange = (e) => {
    const { name, value } = e.target;
    const regularData = {
      ...regularInstallmentData,
      [name]: value,
    };

    // Calculate the result (R) when the user enters interest rate and withholding tax
    const interest = parseFloat(regularData.interest);
    const withholdingTax = parseFloat(regularData.withholdingTax);

    if (!isNaN(interest) && !isNaN(withholdingTax)) {
      const R = (interest / 12) * (1 - withholdingTax / 100);
      setCalculatedRegularResult(R);
    } else {
      // Clear the result if either interest or withholdingTax is not a valid number
      setCalculatedRegularResult(null);
    }

    setRegularInstallmentData(regularData);
    calculateYearsUntil18(regularData.birthday, 'regular');
  };

  const handleLumpSumInputChange = (e) => {
    const { name, value } = e.target;
    const lumpSumData = {
      ...lumpSumInstallmentData,
      [name]: value,
    };

    // Calculate the result (R) when the user enters interest rate and withholding tax for lump sum
    const interest = parseFloat(lumpSumData.interest);
    const withholdingTax = parseFloat(lumpSumData.withholdingTax);

    if (!isNaN(interest) && !isNaN(withholdingTax)) {
      const R = (interest / 12) * (1 - withholdingTax / 100);
      setCalculatedLumpSumResult(R);
    } else {
      // Clear the result if either interest or withholdingTax is not a valid number
      setCalculatedLumpSumResult(null);
    }

    setLumpSumInstallmentData(lumpSumData);
    calculateYearsUntil18(lumpSumData.birthday, 'lumpSum');
  };

  const calculateYearsUntil18 = (birthday, installmentType) => {
    if (!birthday) {
      if (installmentType === 'regular') {
        setYearsUntil18Regular(null);
      } else if (installmentType === 'lumpSum') {
        setYearsUntil18LumpSum(null);
      }
      return;
    }

    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--; 
    }

    if (age >= 18) {
      if (installmentType === 'regular') {
        setYearsUntil18Regular(0);
      } else if (installmentType === 'lumpSum') {
        setYearsUntil18LumpSum(0);
      }
    } else {
      const yearsUntil18 = 18 - age;
      if (installmentType === 'regular') {
        setYearsUntil18Regular(yearsUntil18);
        setNRegular(yearsUntil18 * 12);
      } else if (installmentType === 'lumpSum') {
        setYearsUntil18LumpSum(yearsUntil18);
        setNLumpSum(yearsUntil18 * 12);
      }
    }
  };

  return (
    <div className="installment-form-container">
      <h2>Select an Installment option:</h2>
      <label>
        <input
          type="radio"
          value="regular"
          checked={selectedOption === 'regular'}
          onChange={handleOptionChange}
        />
        Regular Installment
      </label>
      <label>
        <input
          type="radio"
          value="lumpSum"
          checked={selectedOption === 'lumpSum'}
          onChange={handleOptionChange}
        />
        Installment with Lump Sum
      </label>

{/* --------------------------------------------------Regular Form---------------------------------------------------------------- */}

      {selectedOption === 'regular' && (
        <div className="regular-installment-form">
          <h3>Regular Installment Form</h3>
          <form>
            <label>
              Birthday:
              <input
                type="date"
                name="birthday"
                value={regularInstallmentData.birthday}
                onChange={(e) => {
                  handleRegularInputChange(e);
                }}
              />
            </label>
            {yearsUntil18Regular !== null && (
              <p>You have {yearsUntil18Regular} years until you reach 18 years old.</p>
            )}
            {nRegular !== null && (
              <p>You have {nRegular} months until you reach 18 years old.</p>
            )}
            <br />
            <label>
              Interest (%):
              <input
                type="number"
                name="interest"
                step="0.01"
                min="0"
                value={regularInstallmentData.interest}
                onChange={handleRegularInputChange}
              />
            </label>
            <br />
            <label>
              Withholding Tax (%):
              <input
                type="number"
                name="withholdingTax"
                step="0.01"
                min="0"
                value={regularInstallmentData.withholdingTax}
                onChange={handleRegularInputChange}
              />
            </label>
            <br />
            <label>
              Amount (Minimum Rs.100,000):
              <input
                type="number"
                name="amount"
                step="100000"
                min="100000"
                value={regularInstallmentData.amount}
                onChange={handleRegularInputChange}
              />
            </label>
            <br />
            <label>
              Installment Frequency:
              <select
                name="frequency"
                value={regularInstallmentData.frequency}
                onChange={handleRegularInputChange}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </label>
            <br />
            <label>
              Result (R):
              <input
                type="text"
                name="result"
                readOnly
                value={calculatedRegularResult !== null ? calculatedRegularResult.toFixed(2) : ''}
              />
            </label>
            
            <label>
              Regullar Installment
              <input
                type="text"
                name="resultregular"
                readOnly
                value={calculatedRegularResult !== null ? calculatedRegularResult.toFixed(2) : ''}
              />
            </label>
          </form>
        </div>
      )}

      {/* -----------------------------------------Lump Sum form---------------------------------------------------- */}

      {selectedOption === 'lumpSum' && (
        <div className="lump-sum-installment-form">
          <h3>Installment with Lump Sum Form</h3>
          <form>
            <label>
              Birthday:
              <input
                type="date"
                name="birthday"
                value={lumpSumInstallmentData.birthday}
                onChange={(e) => {
                  handleLumpSumInputChange(e);
                }}
              />
            </label>
            {yearsUntil18LumpSum !== null && (
              <p>You have {yearsUntil18LumpSum} years until you reach 18 years old.</p>
            )}
            {nLumpSum !== null && (
              <p>You have {nLumpSum} months until you reach 18 years old.</p>
            )}
            <br />
            <label>
              Interest (%):
              <input
                type="number"
                name="interest"
                step="0.01"
                min="0"
                value={lumpSumInstallmentData.interest}
                onChange={handleLumpSumInputChange}
              />
            </label>
            <br />
            <label>
              Withholding Tax (%):
              <input
                type="number"
                name="withholdingTax"
                step="0.01"
                min="0"
                value={lumpSumInstallmentData.withholdingTax}
                onChange={handleLumpSumInputChange}
              />
            </label>
            <br />
            <label>
              Amount :
              <input
                type="number"
                name="amount"
                step="100000"
                min="100000"
                value={lumpSumInstallmentData.amount}
                onChange={handleLumpSumInputChange}
              />
            </label>
            <br />
            <label>
              Lump Sum Amount:
              <input
                type="number"
                name="lumpSumAmount"
                step="100000"
                min="100000"
                value={lumpSumInstallmentData.lumpSumAmount}
                onChange={handleLumpSumInputChange}
              />
            </label>
            <br />
            <label>
              Result (R):
              <input
                type="text"
                name="lumpSumResult"
                readOnly
                value={calculatedLumpSumResult !== null ? calculatedLumpSumResult.toFixed(2) : ''}
              />
            </label>
          </form>
        </div>
      )}
    </div>
  );
};

export default InstallmentForm;

