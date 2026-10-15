import type { BuildingCollection, WalkwayCollection } from "@/types/map";
import type { FeatureCollection, Polygon } from "geojson";

export const mockBuildingsGeoJson: BuildingCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "blk_a",
        name: "Block A — Computer Science & Engineering",
        code: "BLK_A",
        totalFloors: 4,
        hasElevator: true,
        wheelchairEntry: true,
        thumbnailUrl: "/buildings/blk_a.jpg",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.4762, 17.4060],
            [78.4774, 17.4060],
            [78.4774, 17.4070],
            [78.4762, 17.4070],
            [78.4762, 17.4060],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "blk_b",
        name: "Block B — Electronics & Electrical Engineering",
        code: "BLK_B",
        totalFloors: 3,
        hasElevator: false,
        wheelchairEntry: true,
        thumbnailUrl: "/buildings/blk_b.jpg",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.4778, 17.4060],
            [78.4789, 17.4060],
            [78.4789, 17.4070],
            [78.4778, 17.4070],
            [78.4778, 17.4060],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "blk_c",
        name: "Block C — Mechanical & Civil Engineering",
        code: "BLK_C",
        totalFloors: 3,
        hasElevator: true,
        wheelchairEntry: true,
        thumbnailUrl: "/buildings/blk_c.jpg",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.4793, 17.4060],
            [78.4804, 17.4060],
            [78.4804, 17.4070],
            [78.4793, 17.4070],
            [78.4793, 17.4060],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "library",
        name: "Central Library & Knowledge Resource Centre",
        code: "LIB",
        totalFloors: 3,
        hasElevator: true,
        wheelchairEntry: true,
        thumbnailUrl: "/buildings/library.jpg",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.4768, 17.4074],
            [78.4782, 17.4074],
            [78.4782, 17.4084],
            [78.4768, 17.4084],
            [78.4768, 17.4074],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "admin",
        name: "Administrative Complex & Registrar",
        code: "ADMIN",
        totalFloors: 2,
        hasElevator: true,
        wheelchairEntry: true,
        thumbnailUrl: "/buildings/admin.jpg",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.4750, 17.4050],
            [78.4764, 17.4050],
            [78.4764, 17.4058],
            [78.4750, 17.4058],
            [78.4750, 17.4050],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "sac",
        name: "Student Activity Centre & Cafeteria",
        code: "SAC",
        totalFloors: 2,
        hasElevator: false,
        wheelchairEntry: true,
        thumbnailUrl: "/buildings/sac.jpg",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.4772, 17.4046],
            [78.4786, 17.4046],
            [78.4786, 17.4056],
            [78.4772, 17.4056],
            [78.4772, 17.4046],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "health_centre",
        name: "Health & Wellness Centre",
        code: "HLTH",
        totalFloors: 1,
        hasElevator: false,
        wheelchairEntry: true,
        thumbnailUrl: "/buildings/health.jpg",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.4740, 17.4062],
            [78.4750, 17.4062],
            [78.4750, 17.4070],
            [78.4740, 17.4070],
            [78.4740, 17.4062],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "hostel_nilgiri",
        name: "Nilgiri Boys Hostel",
        code: "BH_1",
        totalFloors: 4,
        hasElevator: true,
        wheelchairEntry: true,
        thumbnailUrl: "/buildings/hostel_nilgiri.jpg",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.4795, 17.4080],
            [78.4810, 17.4080],
            [78.4810, 17.4092],
            [78.4795, 17.4092],
            [78.4795, 17.4080],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "hostel_sahyadri",
        name: "Sahyadri Girls Hostel",
        code: "GH_1",
        totalFloors: 4,
        hasElevator: true,
        wheelchairEntry: true,
        thumbnailUrl: "/buildings/hostel_sahyadri.jpg",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.4740, 17.4085],
            [78.4755, 17.4085],
            [78.4755, 17.4097],
            [78.4740, 17.4097],
            [78.4740, 17.4085],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "sports_complex",
        name: "Indoor Sports Complex & Gymnasium",
        code: "SPORTS",
        totalFloors: 2,
        hasElevator: false,
        wheelchairEntry: true,
        thumbnailUrl: "/buildings/sports.jpg",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.4792, 17.4040],
            [78.4810, 17.4040],
            [78.4810, 17.4052],
            [78.4792, 17.4052],
            [78.4792, 17.4040],
          ],
        ],
      },
    },
  ],
};

export const mockPathwaysGeoJson: WalkwayCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "path_main_gate_to_admin",
        name: "Main Gate to Admin Avenue",
        type: "ROAD",
        isWheelchairAccessible: true,
        surface: "ASPHALT",
        width: 6,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [78.4755, 17.4032],
          [78.4756, 17.4042],
          [78.4757, 17.4050],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "path_central_boulevard",
        name: "Central Campus Boulevard",
        type: "FOOTPATH",
        isWheelchairAccessible: true,
        surface: "CONCRETE",
        width: 5,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [78.4757, 17.4050],
          [78.4770, 17.4053],
          [78.4780, 17.4055],
          [78.4795, 17.4055],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "path_academic_quad",
        name: "Academic Quadrangle Walkway",
        type: "FOOTPATH",
        isWheelchairAccessible: true,
        surface: "CONCRETE",
        width: 4,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [78.4768, 17.4055],
          [78.4768, 17.4065],
          [78.4780, 17.4065],
          [78.4798, 17.4065],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "path_library_promenade",
        name: "Library Garden Promenade",
        type: "FOOTPATH",
        isWheelchairAccessible: true,
        surface: "CONCRETE",
        width: 3.5,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [78.4775, 17.4065],
          [78.4775, 17.4074],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "path_sac_cafeteria",
        name: "Cafeteria & SAC Connector",
        type: "FOOTPATH",
        isWheelchairAccessible: true,
        surface: "CONCRETE",
        width: 4,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [78.4770, 17.4053],
          [78.4779, 17.4051],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "path_hostel_nilgiri_link",
        name: "Nilgiri Hostel Road",
        type: "ROAD",
        isWheelchairAccessible: true,
        surface: "ASPHALT",
        width: 5,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [78.4795, 17.4055],
          [78.4802, 17.4068],
          [78.4802, 17.4080],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "path_hostel_sahyadri_link",
        name: "Sahyadri Hostel West Walk",
        type: "FOOTPATH",
        isWheelchairAccessible: true,
        surface: "CONCRETE",
        width: 3,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [78.4757, 17.4050],
          [78.4745, 17.4065],
          [78.4748, 17.4085],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "path_sports_link",
        name: "Sports Complex South Path",
        type: "FOOTPATH",
        isWheelchairAccessible: true,
        surface: "CONCRETE",
        width: 3.5,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [78.4785, 17.4046],
          [78.4795, 17.4046],
          [78.4801, 17.4046],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "path_botanical_steps",
        name: "Botanical Garden Shortcut (Steps)",
        type: "FOOTPATH",
        isWheelchairAccessible: false,
        surface: "GRAVEL",
        width: 1.5,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [78.4760, 17.4072],
          [78.4764, 17.4078],
          [78.4768, 17.4084],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "path_sports_bleacher_stairs",
        name: "Sports Field Bleachers Stairway",
        type: "FOOTPATH",
        isWheelchairAccessible: false,
        surface: "CONCRETE",
        width: 1.8,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [78.4805, 17.4040],
          [78.4812, 17.4044],
        ],
      },
    },
  ],
};

export const mockBoundaryGeoJson: FeatureCollection<Polygon, any> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "campus_perimeter",
        name: "Smart Campus Boundary",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.4730, 17.4030],
            [78.4815, 17.4030],
            [78.4820, 17.4065],
            [78.4818, 17.4100],
            [78.4775, 17.4108],
            [78.4735, 17.4102],
            [78.4725, 17.4070],
            [78.4728, 17.4045],
            [78.4730, 17.4030],
          ],
        ],
      },
    },
  ],
};