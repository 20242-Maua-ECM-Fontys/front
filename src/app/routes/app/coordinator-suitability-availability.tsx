  import { ContentLayout } from '@/components/layouts';
  import { ScrollArea } from '@/components/ui/scroll-area';
  import WeekAvailability from '@/components/ui/week-availability-update';
  import { useMsal} from '@azure/msal-react';
  import { useState } from 'react';
  import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { set } from 'zod';
import { Button } from '@/components/ui/button';


  export const CoordinatorSuitabilityAndAvailabilityRoute = () => {
    const {instance, accounts} = useMsal();
    const [weekKey, setWeekKey] = useState(0);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

    const handleProfessorSelect = (professor: Professor) => {
      setSelectedProfessor(professor);
      setSelectedSubjects(professor.suitabilities.map((s) => s.subjectName));
      setWeekKey((prevKey) => prevKey + 1);
    }

    interface Availability {
      startTime: number; // em minutos
      endTime: number;   // em minutos
      weekDay: string;
    }
    

    type Professor = {
      name: string,
      email: string,
      availabilities: Availability[], 
      suitabilities: {
        codeSubject: string,
        subjectName: string
      }[]
    }

    type Professors = {
      [key: number ]:{name: string,
      email: string,
      availabilities: {
        startTime: number,
        endTime: number,
        weekDay: string
      }[],
      suitabilities: {
        codeSubject: string,
        subjectName: string
      }[]}
    }

    const professors: Professors = {
      1: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        availabilities: [
          //7h40 - 9h20
          { startTime: 460, endTime: 560, weekDay: 'MON' },
          //9h30 - 11h10
          { startTime: 570, endTime: 670, weekDay: 'TUE' },
          //11h20 - 13h00
          { startTime: 680, endTime: 780, weekDay: 'WED' },
        ],
        suitabilities: [
          { codeSubject: 'CN', subjectName: 'Computer Networks' },
          { codeSubject: 'CP', subjectName: 'Computer Programming' },
        ],
      },
      2: {
        name: 'Jane Doe',
        email: 'janedoe@gmail.com',
        availabilities: [
          //7h40 - 9h20
          { startTime: 460, endTime: 560, weekDay: 'THU' },
          //9h30 - 11h10
          { startTime: 570, endTime: 670, weekDay: 'FRI' },
          //11h20 - 13h00
          { startTime: 680, endTime: 780, weekDay: 'SAT' },
        ],
        suitabilities: [
          { codeSubject: 'CN', subjectName: 'Computer Networks' },
          { codeSubject: 'CP', subjectName: 'Computer Programming' },
        ],
      },
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

    const all_subjects = [
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
          'Dynamics',
          'Engineering Mechanics',
          'Fluid Mechanics',
          'Heat Transfer',
          'Machine Design',
          'Materials Science',
          'Mechanics of Materials',
          'Thermodynamics',
          'Vibrations',
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
          'Computer Architecture',
          'Computer Networks',
          'Computer Programming',
          'Computer Security',
          'Data Structures',
          'Databases',
          'Digital Logic',
          'Discrete Mathematics',
          'Operating Systems',
          'Software Engineering'
        ]

    return (
      <div>
        <div className="flex h-screen items-center">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
            <h2 className="p-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Teachers' Availability and Suitability</span>
            </h2>
              <p>View and manage teachers' availability and suitability</p>
            <div className="flex gap-4 justify-center items-center">
              <button className="mt-4 rounded bg-gray-200 px-4 py-2  transition duration-300 hover:bg-blue-400 hover:text-white"
                          onClick={() => document
                        .getElementById('teachers-table')
                        ?.scrollIntoView({ behavior: 'smooth' })}>Search a teacher</button>
            </div>
          </div>
        </div>
        <div id="teachers-table" className='flex min-h-screen items-center justify-center'>
          <div className="flex w-full h-full p-4">
            
            <Command className='min-h-[56vh]'>  
              <h2 className="text-2xl font-semibold p-4">Professors</h2>
              <CommandInput placeholder="Type a professor name..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Professors">
                  {Object.keys(professors).map((professorId) => (
                    <CommandItem key={professorId}
                      onSelect={() => {handleProfessorSelect(professors[professorId]);
                      document
                        .getElementById('subject-possibilities')
                        ?.scrollIntoView({ behavior: 'smooth' });}
                      }>
                      {professors[professorId].name}
                    </CommandItem>
                  ))}
                  
                </CommandGroup>
              </CommandList>
            </Command>    
          </div>
        </div>

        <div id="subject-possibilities" className='min-h-screen'>
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

          <Command className='min-h-[49vh]'> 
              <CommandInput placeholder="Type a subject name..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Subjects">
                  {
                    // fazer dois for, um para os cursos e outro para as disciplinas
                    subjects.map((subject) => (
                      Object.keys(subject).map((course) => (
                        subject[course].map((subjectName) => (
                          <CommandItem key={subjectName}
                            onSelect={() => {handleSubjectAdd(subjectName);}}
                            className={`p-2 transition duration-300 flex items-center justify-center cursor-pointer ${
                              selectedSubjects.includes(subjectName)
                                ? 'bg-blue-400 text-white'
                                : 'hover:bg-blue-400 hover:text-white'
                            }`}
                            >
                            {subjectName}
                          </CommandItem>
                        ))
                      ))
                    ))
                  }
                  
                </CommandGroup>
              </CommandList>
            </Command>
            <div className="flex gap-4 justify-center items-center">
            {selectedProfessor ? (
              <Button
                className='mt-4 rounded bg-gray-400 px-4 py-2  transition duration-300 hover:bg-blue-400 hover:text-white'
              >
                Save
              </Button>
            ) : <Button disabled className='mt-4 rounded bg-gray-200 px-4 py-2 text-black  transition duration-300'>
                Save
              </Button>}
            
            </div>
        </div>
        
        <div
          className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center p-4 text-center sm:px-6 lg:px-8 lg:py-10 mt-10 md:mt-0"
          id="table-possibilities"
        >
          <h3 className="mb-4 text-center text-xl font-bold">
            Set Your Availability
          </h3>
          <WeekAvailability
            startHour={'07:40'}
            endHour={'22:20'}
            initialAvailability={selectedProfessor?.availabilities || []}
            key={weekKey}
          />
        </div>

      </div>

    );
  };
