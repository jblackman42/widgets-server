import React, { useState, useEffect } from 'react';
import { httpRequest } from '../lib/utils';
import TeamMember from '../components/TeamMember';
import Spinner from '../components/Loading';

const Button = ({onClick, children}) => <button onClick={onClick} data-select="true" className="bg-accent hover:brightness-125 data-[selected=true]: transition-colors border-4 border-accent w-full rounded-sm p-1 px-2 text-white font-semibold">{children}</button>;

const StaffTeams = ({priority = "", handleError}) => {
  const allTeamsValue = "0";
  const [allStaff, setAllStaff] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(allTeamsValue);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const sortPeopleByJobTitle = (staffList) => {
      const priorityOrder = priority.split(',').map(title => title.trim());
  
      // Get the index for '*', or the end of the list if '*' is not present
      const defaultIndex = priorityOrder.indexOf('*') !== -1 ? priorityOrder.indexOf('*') : priorityOrder.length;
      // Initialize the array for grouping staff members based on priority index
      const staffGroupedByPriority = Array.from({ length: priorityOrder.length + 1 }, () => []);
  
      staffList.forEach((staffMember) => {
        let groupIndex = defaultIndex;
        let maxLength = 0;  // Variable to store the maximum length of a matched job title
  
        // Iterate over all priorities to find the longest match
        for (let i = 0; i < priorityOrder.length; i++) {
          if (staffMember.Job_Title.includes(priorityOrder[i]) && priorityOrder[i].length > maxLength) {
            maxLength = priorityOrder[i].length; // Update the maximum length found
            groupIndex = i; // Update the group index to the current priority index
          }
        }
  
        // Place the staff member in the appropriate group
        staffGroupedByPriority[groupIndex].push(staffMember);
      });
  
      // Sort each group by last name
      staffGroupedByPriority.forEach(group => group.sort((a, b) => a.Last_Name.localeCompare(b.Last_Name)));
  
      // Flatten the grouped array into a single array and return
      return staffGroupedByPriority.flat();
    };
    (async () => {
      try {
        const staff = await httpRequest(`${process.env.BASE_URL}/Api/staff`, 'POST');
        const sortedStaff = sortPeopleByJobTitle(staff);
        const allTeams = Array.from(new Set(staff.map(staff => staff.Team_Name))).sort();
        setTeams(allTeams)
        setAllStaff(sortedStaff);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        handleError("Internal error: Failed to load staff data");
      }
    })();
  }, [priority]);

  if (loading) return <Spinner />;

  return (
    <div className="w-full p-2 mx-auto">
      <div className="block md:hidden">
        <select className="w-full mb-4 p-2 py-1 text-xl shadow-md rounded-sm" defaultValue={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
          <option value={allTeamsValue}>All Teams</option>
          {teams.map((team, i) => <option key={i} value={team}>{team}</option>)}
        </select>
      </div>
      <div className="flex justify-center gap-6">
        <div className="hidden md:flex flex-col gap-2">
          <Button onClick={() => setSelectedTeam(allTeamsValue)}>All Teams</Button>
          {teams.map((team, i) => <Button key={i} onClick={() => setSelectedTeam(team)}>{team}</Button>)}
        </div>
        <div className="w-max h-max grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {allStaff.map((staff, i) => <div key={i} style={{display: selectedTeam === allTeamsValue || staff.Team_Name === selectedTeam ? "block" : "none"}}><TeamMember staff={staff} /></div>)}
        </div>
      </div>
    </div>
  );
}

export const Component = StaffTeams;
export const HTMLElementName = 'staff-teams';