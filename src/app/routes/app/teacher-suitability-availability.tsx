  import { ContentLayout } from '@/components/layouts';
  import { ScrollArea } from '@/components/ui/scroll-area';
  import WeekAvailability from '@/components/ui/week-availability';
  import { useMsal} from '@azure/msal-react';
  import { useState } from 'react';


  export const TeacherSuitabilityAndAvailabilityRoute = () => {
    const {instance, accounts} = useMsal();
    const [weekKey, setWeekKey] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState('Computer Engineering');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    const handleCourseChange = (course: string) => {
      setSelectedCourse(course);
    };

    const handleSubjectAdd = (subject: string) => {
      if (selectedSubjects.includes(subject)) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
        return;
      }
      setSelectedSubjects([...selectedSubjects, subject]);
    }

    const subjects: { [key: string]: string[] }[] = [
      {
        'Computer Engineering': [
          'Computer Architecture',
          'Computer Networks',
          'Computer Programming',
          'Computer Security',
          'Data Structures',
          'Databases',
          'Digital Logic',
          'Discrete Mathematics',
          'Operating Systems',
          'Software Engineering',
        ]
      },
      {
        'Electrical Engineering': [
          'Analog Electronics',
          'Circuit Analysis',
          'Control Systems',
          'Digital Electronics',
          'Digital Signal Processing',
          'Electromagnetics',
          'Electronics',
          'Linear Systems',
          'Power Systems',
          'Signals and Systems',
        ]
      },
      {
        'Mechanical Engineering': [
          'Dynamics',
          'Engineering Mechanics',
          'Fluid Mechanics',
          'Heat Transfer',
          'Machine Design',
          'Materials Science',
          'Mechanics of Materials',
          'Thermodynamics',
          'Vibrations',
        ]
      },
      {
      'Civil Engineering': [
        'Concrete Design',
        'Construction Management',
        'Environmental Engineering',
        'Geotechnical Engineering',
        'Hydraulics',
        'Materials Testing',
        'Reinforced Concrete',
        'Steel Design',
        'Structural Analysis',
        'Surveying',
        ]
      },
      {
        'Chemical Engineering': [
          'Chemical Kinetics',
          'Chemical Process Control',
          'Chemical Reaction Engineering',
          'Chemical Thermodynamics',
          'Fluid Mechanics',
          'Heat Transfer',
          'Mass Transfer',
          'Materials Science',
          'Process Design',
          'Transport Phenomena',
        ]
      },
      {
        'Biomedical Engineering': [
          'Biomechanics',
          'Biomedical Instrumentation',
          'Biomedical Signal Processing',
          'Biomaterials',
          'Biomechanics',
          'Biomedical Instrumentation',
          'Biomedical Signal Processing',
          'Biomaterials',
          'Biomedical Imaging',
          'Physiology',
        ]
      },
      {
        'Aerospace Engineering': [
          'Aerodynamics',
          'Aerospace Materials',
          'Aircraft Design',
          'Aircraft Structures',
          'Astrodynamics',
          'Flight Dynamics',
          'Propulsion',
          'Spacecraft Design',
          'Spacecraft Structures',
          'Thermodynamics',
        ]
      },
      {
        'Industrial Engineering': [
          'Engineering Management',
          'Engineering Statistics',
          'Facilities Planning',
          'Human Factors Engineering',
          'Industrial Automation',
          'Industrial Engineering',
          'Manufacturing Processes',
          'Operations Research',
          'Quality Control',
          'Supply Chain Management',
        ]
      },
      {
        'Software Engineering': [
          'Agile Software Development',
          'Computer Programming',
          'Data Structures',
          'Databases',
          'Operating Systems',
          'Software Architecture',
          'Software Design',
          'Software Engineering',
          'Software Testing',
          'Web Development',
        ]
      },
    ]

    return (
      <div>
        <div className="flex h-screen items-center">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
            <h2 className="p-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Availability and Suitability</span>
            </h2>
            <div className="flex gap-4 justify-center items-center">
              <button className="mt-4 rounded bg-gray-200 px-4 py-2  transition duration-300 hover:bg-blue-400 hover:text-white"
                          onClick={() => document
                        .getElementById('select-course')
                        ?.scrollIntoView({ behavior: 'smooth' })}>Fill suitabilities</button>
              <button className="mt-4 rounded bg-gray-200 px-4 py-2  transition duration-300 hover:bg-blue-400 hover:text-white"
                          onClick={() => document
                        .getElementById('table-possibilities')
                        ?.scrollIntoView({ behavior: 'smooth' })}>Fill availabilities</button>
            </div>
          </div>
        </div>
        <div className="flex h-screen items-center" id='select-course'>
          <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16" >
            <h3 className="text-2xl font-bold">Select Your Course</h3>
            {/* Show all the selected subjects*/}
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3 sm:grid-cols-1">
              {subjects.map((subject) => (
                Object.keys(subject).map((subjectName) => (
                  <div key={subjectName} className={`rounded border p-2 transition duration-300 flex items-center justify-center cursor-pointer ${
                selectedCourse === subjectName
                  ? 'bg-blue-400 text-white'
                  : 'bg-gray-200 hover:bg-blue-400 hover:text-white'
              }`}
                    onClick={() => {
                      handleCourseChange(subjectName);
                      document.getElementById('subject-possibilities')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    >
                    <h4 className="text-lg font-bold text-center">{subjectName}</h4>
                  </div>
                ))
              ))}
            </div>
            
          </div>
        </div>
        <div id="subject-possibilities">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
              <h2 className="text-2xl font-semibold p-4">Selected Subjects:</h2>
              <div className="flex flex-wrap gap-2 justify-center text-center">
                {selectedSubjects.length === 0 ? (
                  <span className="rounded bg-gray-200 px-3 py-1 text-gray-800">
                    No subjects selected
                  </span>
                ) : (
                  selectedSubjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded bg-green-400 px-3 py-1 flex items-center gap-2"
                    >
                      {subject}
                    </span>
                  ))
                )}
              </div>
            </div>

          <h3 className="text-xl font-bold text-center">{selectedCourse} Subjects</h3>
         <ScrollArea className="h-[400px] rounded-md border p-4 sm:h-[700px] lg:h-[400px]">
          {
            selectedCourse ? (
              <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-1">
                {subjects.map((subject) => (
                  Object.keys(subject).map((subjectName) => (
                    subjectName === selectedCourse ? (
                      subject[selectedCourse].map((tag) => (
                        <div key={tag} className={`rounded border p-2 transition duration-300 flex items-center justify-center cursor-pointer ${
                          selectedSubjects.includes(tag)
                            ? 'bg-blue-400 text-white'
                            : 'bg-gray-200 hover:bg-blue-400 hover:text-white'
                        }`}
                        onClick={() => handleSubjectAdd(tag)}
                        >
                          <h4 className="text-lg font-bold text-center">{tag}</h4>
                        </div>
                      ))
                    ) : null
                  ))
                ))}
              </div>
            ) : null
          }
        </ScrollArea>

        </div>
        
        <div
          className="mx-auto flex h-screen max-w-7xl flex-col items-center justify-center p-4 text-center sm:px-6 lg:px-8 lg:py-10 mt-10 md:mt-0"
          id="table-possibilities"
        >
          <h3 className="mb-4 text-center text-xl font-bold">
            Set Your Availability
          </h3>
          <WeekAvailability
            startHour={'07:40'}
            endHour={'22:20'}
            key={weekKey}
          />
        </div>

      </div>

    );
  };
