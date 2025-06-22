from flask import Blueprint, request, jsonify

route_bp = Blueprint("save_route", __name__)

@route_bp.route("/api/route/save", methods=["POST"])
def save_route():
    user_id = request.args.get("user_id")
    route_id = request.args.get("route_id")
    custom_name = request.args.get("custom_name")
    print(f"저장 요청: user_id={user_id}, route_id={route_id}, name={custom_name}")

    return jsonify({ "status": "success", "message": "경로가 저장되었습니다." })
