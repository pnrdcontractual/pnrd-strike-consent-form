// REPLACE_WITH_YOUR_GOOGLE_APPS_SCRIPT_URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4LL551l8bUnykANPuSr5n3wVnwknSzQJnDEu8uWfVxsD_WMZgOPemYuT5xsPkuIUh/exec';

// District-Block Mapping
const districtBlocks = {
    'BAJALI': ['BAJALI','BHAWANIPUR'],
    'BAKSA': ['Barama','Baska','Dhamdhama','Gobardhana(BTC)','Jalah(BTC)'],
    'BARPETA': ['CHAKCHAKA','CHENGA','GHILAJHARI-RUPSHI','GOBARDHANA','GOMAPHULBARI','KALGACHIA','MANDIA','PAKABETBARI','SARUKHETRI'],
    'Biswanath': ['BAGHMARA','BEHALI','BISWANATH','CHAIDUAR','PUB CHAIDUAR','SAKOMATHA'],
    'BONGAIGAON': ['BIDYAPUR','BOITAMARI','MANIKPUR','SRIJANGRAM','TAPATTARY'],
    'CACHAR': ['Banskandi','Binnakandi','Borjalenga','Borkhola','DHOLAI NARSINGPUR','Kalain','KATIGORA','LAKHIPUR','Palonghat','RAJABAZAR','Rongpur','Silchar','SONAI','Tapang','UDHARBOND'],
    'CHARAIDEO': ['LAKUWA','MAHMORA','SAPEKHATI','SONARI'],
    'CHIRANG': ['BOROBAZAR','MANIKPUR','SIDLI-CHIRANG'],
    'DARRANG': ['BECHIMARI','Dalgaon-Sialmari','KALAIGAON','PACHIM-MANGALDAI','PUB-MANGALDAI','SIPAJHAR'],
    'DHEMAJI': ['BORDOLONI','DHEMAJI','MACHKHOWA','MURKONGSELEK','Simen Sissitongani','SISSIBORGAON'],
    'DHUBRI': ['AGOMONI','ATHANI','BALAJAN','BILASIPARA','BIRSING JARUA','CHAPOR SALKOCHA','DEBITOLA','Dharmasala','GOLOKGANJ','MAHAMAYA','NASKARA JAMADARHAT','NAYERALGA','RUPSHI'],
    'DIBRUGARH': ['BORBORUAH','CHABUA','KHOWANG','LAHOWAL','NAHARKATIA','TENGAKHAT','TINGKHONG'],
    'Dima Hasao': ['DIYUNG VALLEY','DIYUNGBRA','HARANGAJAO','JATINGA VALLEY','NEW SANGBAR'],
    'GOALPARA': ['BALIJANA','DUDHNOI','JALESWAR','KAMAKHYABARI','LAKHIPUR','PAIKAN','RONGJULI','SRI SURYAGIRI'],
    'GOLAGHAT': ['DERGAON NORTH','DERGAON SOUTH','GOLAGHAT CENTRAL','GOLAGHAT EAST','GOLAGHAT SOUTH','GOLAGHAT WEST','GOMARIGURI','MORONGI'],
    'HAILAKANDI': ['ALGAPUR','HAILAKANDI','KATLICHERRA','LALA','SOUTH HAILAKANDI'],
    'HOJAI': ['Binakandi','Dhalpukhuri','Jugijan','Lumding','Odali'],
    'JORHAT': ['East Teok','JORHAT CENTRAL','JORHAT EAST','KALIAPANI','NORTH WEST JORHAT','TITABOR'],
    'KAMRUP': ['BEZERA','BIHDIA JAJIKONA','BOKO','BONGAON','CHAMARIA','CHAYANI RANI','CHHAYGAON MAA CHANDIKA','GOROIMARI','HAJO','KAMALPUR','RAMPUR','RANGIA(PART)','RANI (PART)','SUALKUCHI'],
    'KAMRUP (METRO)': ['BEZERA','CHANDRAPUR','DIMORIA','RAMCHARANI'],
    'KARBI ANGLONG': ['BOKAJAN','HOWRAGHAT','Langsomepi','LUMBAJONG','NILIP','RANGMONGWE','SAMELANGSO'],
    'KOKRAJHAR': ['Bilashipara-BTC','Chapor-Salkocha-BTC','Debitola-BTC','Dotoma','Golakganj-BTC','Gossaigaon','Hatidhura','Kachugaon','Kokrajhar','Mahamaya-BTC','Rupshi-BTC'],
    'LAKHIMPUR': ['BIHPURIA','BOGINADI','DHAKUAKHANA','GHILAMARA','KARUNABARI','LAKHIMPUR','NARAYANPUR','NOWBOICHA','RANGANODI'],
    'MAJULI': ['MAJULI','UJANI MAJULI'],
    'Morigaon': ['BATADRABA MORIGAON PART','Bhuragaon','BHURBANDHA','DOLONGGHAT MORIGAON PART','KAPILI','LAHARIGHAT','MAYONG'],
    'NAGAON': ['Bagariguri','Bajiagaon','Barhampur','DHING','Dolongghat','GARAJAN','Juria','Kaliabor','Kathiatoli','Khagorijan','Niz Dhing','Pachim Kaliabor','Pakhimoria','Raha','SINGIMARI'],
    'NALBARI': ['BARKHETRI','BORBHAG','GHOGRAPAR','MADHUPUR','NALBARI','PASCHIM NALBARI','TIHU'],
    'SIVASAGAR': ['AMGURI','DEMOW','GAURISAGAR','NAZIRA','SIVASAGAR'],
    'SONITPUR': ['BALIPARA','BIHAGURI','BORCHALA','DHEKIAJULI','GABHORU','NADUAR','RANGAPARA','SOOTEA'],
    'SOUTH SALMARA-MANKACHAR': ['FEKAMARI','MANKACHAR','SOUTH SALMARA'],
    'Sribhumi': ['BADARPUR CHAITANYANAGAR','BHAIRAB NAGAR','DULLAVCHERRA','LOWAIRPOA','MALEGARH','NILAMBAZAR','PATHARKANDI'],
    'TAMULPUR': ['Goreswar','Nagrijuli','Tamulpur'],
    'TINSUKIA': ['DIGBOI','DOOMDOOMA','ITAKHULI','MAKUM','MARGHERITA','SADIYA','SAIKHOWA'],
    'UDALGURI': ['Bechimari','Bhergaon','Borsola','Dalgaon-Sialmari','Kalaigaon','Khoirabari','Mazbat','Paschim-Mangaldai','Pub-Mangaldai','Rowta','Udalguri'],
    'WEST KARBI ANGLONG': ['AMRI','CHINTHONG','RONGKHANG','SOCHENG']
};

let employees = [];
let currentSignatureFile = null;

// Initialize
document.addEventListener('47', function() {
    populateDistricts();
    setupFormHandlers();
    loadFromGoogleSheet();
    });

// Populate Districts
function populateDistricts() {
    const districtSelect = document.getElementById('district');
    Object.keys(districtBlocks).sort().forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
}

// District Change Handler
document.getElementById('district')?.addEventListener('change', function() {
    const district = this.value;
    const blockSelect = document.getElementById('block');
    blockSelect.innerHTML = '<option value="">Select Block</option>';
    
    if(district && districtBlocks[district]) {
        districtBlocks[district].forEach(block => {
            const option = document.createElement('option');
            option.value = block;
            option.textContent = block;
            blockSelect.appendChild(option);
        });
    }
});

// Handle Signature Upload from both inputs
function handleSignatureUpload(input) {
    const file = input.files[0];
    if(file) {
        currentSignatureFile = file;
        const reader = new FileReader();
        reader.onload = function(event) {
            let preview = document.getElementById('imagePreview');
            if (!preview) {
                // Create preview div if it doesn't exist
                const signatureDiv = input.parentElement;
                preview = document.createElement('div');
                preview.id = 'imagePreview';
                preview.className = 'mt-2';
                signatureDiv.appendChild(preview);
            }
            preview.innerHTML = '<img src="' + event.target.result + '" alt="Signature Preview">';
        };
        reader.readAsDataURL(file);
    }
}


// Setup Form Handlers
function setupFormHandlers() {
    const form = document.getElementById('employeeForm');
    form.addEventListener('submit', handleFormSubmit);
}

// Handle Form Submit
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        slNo: document.getElementById('slNo').value,
        district: formData.get('district'),
        block: formData.get('block'),
        name: formData.get('name'),
        designation: formData.get('designation'),
        employeeId: formData.get('employeeId'),
        agreement: formData.get('agreement'),
        signature: null
    };
    
    // Convert signature to base64
    if(currentSignatureFile) {
        data.signature = await fileToBase64(currentSignatureFile);
    }
    
    // Add to local storage
    employees.push(data);
    saveEmployees();
    displayRecords();
    
    // Submit to Google Apps Script
    submitToGoogle(data);
    
    // Reset form
    e.target.reset();
    document.getElementById('imagePreview').innerHTML = '';
    currentSignatureFile = null;
    updateSLNo();
    
    // Show success message
    const msg = document.getElementById('submitMessage');
    msg.textContent = 'Employee added successfully!';
    setTimeout(() => msg.textContent = '', 3000);
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Submit to Google
async function submitToGoogle(data) {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        console.log('Submitted to Google');
    } catch(error) {
        console.error('Error submitting to Google:', error);
    }
}

// Update SL No
function updateSLNo() {
    document.getElementById('slNo').value = employees.length + 1;
}

// Save to localStorage
function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Load from localStorage
function loadEmployees() {
    const stored = localStorage.getItem('employees');
    if(stored) {
        employees = JSON.parse(stored);
        displayRecords();
    }
}

// Display Records
function displayRecords() {
    const container = document.getElementById('recordsTable');
    if(employees.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No records yet</p>';
        return;
    }
    
    let html = '<table class="table table-bordered"><thead><tr>';
    html += '<th>SL No</th><th>District</th><th>Block</th><th>Name</th>';
    html += '<th>Designation</th><th>Employee ID</th><th>Agreement</th><th>Signature</th>';
    html += '</tr></thead><tbody>';
    
    employees.forEach(emp => {
        html += '<tr>';
        html += '<td>' + emp.slNo + '</td>';
        html += '<td>' + emp.district + '</td>';
        html += '<td>' + emp.block + '</td>';
        html += '<td>' + emp.name + '</td>';
        html += '<td>' + emp.designation + '</td>';
        html += '<td>' + emp.employeeId + '</td>';
        html += '<td>' + emp.agreement + '</td>';
        html += '<td><img src="' + emp.signature + '" alt="Signature"></td>';
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

        // Fetch employee records from Google Sheet
async function loadFromGoogleSheet() {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL + '?action=getData');
        const data = await response.json();
        
        if (data.success && data.records) {
            // Clear localStorage and replace with Sheet data
            employees = data.records;
            localStorage.setItem('employees', JSON.stringify(employees));
            
            // Update SL No to next number
            const nextSLNo = employees.length + 1;
            document.getElementById('slNo').value = nextSLNo;
            
            // Display the records
            displayRecords();
        }
    } catch (error) {
        console.error('Error loading from Google Sheet:', error);
        // Fall back to localStorage if Sheet fetch fails
        displayRecords();
    }
}

// Load data when page loads
window.addEventListener('DOMContentLoaded', () => {
    loadFromGoogleSheet();
});
