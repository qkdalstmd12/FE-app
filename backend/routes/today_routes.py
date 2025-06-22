from flask import Blueprint, request, jsonify

route_bp = Blueprint("fixed_routes", __name__)

@route_bp.route("/api/route/fixed", methods=["GET"])
def get_fixed_routes():
    user_id = request.args.get("user_id")
    print("요청 받은 user_id:", user_id)

    return jsonify([
        {
            "route_id": 1,
            "routine": {
                "routine_id": 1,
                "day": "월",
                "targetTime": "9:00",
                "origin": "반월당",
                "destination": "영남대학교"
            },
            "completed": True,
            "selected_path_idx": 0,
            "selected_path": {
                "path-id": 0,
                "feature": {
                    "park": { "count": 4, "area": 0.0, "ratio": "0.00%" },
                    "river": { "count": 0, "area": 0.0, "ratio": "0.00%" },
                    "amenity": { "count": 2 },
                    "cross": { "count": 0 }
                },
                "recommend": {
                    "similarity": 0.87,
                    "pace_score": 0.769,
                    "final_score": 0.871,
                    "recommended_pace": 6.8,
                    "expected_time": 28
                },
                "coord": [
                    [35.8570576, 128.4952678],
                    [35.8582668, 128.4953857],
                    [35.8491296, 128.5172792]
                ]
            }
        },
        {
            "route_id": 2,
            "routine": {
                "routine_id": 2,
                "day": "월",
                "targetTime": "12:00",
                "origin": "영남대학교",
                "destination": "임당역"
            },
            "completed": True,
            "selected_path_idx": 0,
            "selected_path": {
                "path-id": 0,
                "feature": {
                    "park": { "count": 4, "area": 0.0, "ratio": "0.00%" },
                    "river": { "count": 0, "area": 0.0, "ratio": "0.00%" },
                    "amenity": { "count": 2 },
                    "cross": { "count": 0 }
                },
                "recommend": {
                    "similarity": 0.87,
                    "pace_score": 0.769,
                    "final_score": 0.871,
                    "recommended_pace": 6.8,
                    "expected_time": 28
                },
                "coord": [
                    [35.8570576, 128.4952678],
                    [35.8582668, 128.4953857],
                    [35.8491296, 128.5172792]
                ]
            }
        }
    ])
