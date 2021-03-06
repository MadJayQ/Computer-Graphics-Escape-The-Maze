/*
  Extension functions for Math class.
*/

Math.PITCH = 0;
Math.YAW = 1;
Math.ROLL = 2;
Math.X = 0;
Math.Y = 1;
Math.Z = 2;

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
}

Math.degrees = (radians) => {
  return radians * 180 / Math.PI;
}

Math.distance = (p1, p2) => {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2));
}

Math.randomRange = function(min, max) {
  return Math.random() * (max - min) + min;
}

Math.randInt = function(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

Math.sinCos = (sin, cos, rad) => {
  sin = Math.sin(rad);
  cos = Math.cos(rad);
}

Math.isPowerOf2 = (value) => {
  return (value & (value - 1)) == 0;
}

Math.angleVectors = (view, forward, right, up) => {
  var sr, sp, sy, cr, cp, cy;

  var pitchRadians = Math.radians(view[Math.PITCH]);
  var yawRadians = Math.radians(view[Math.YAW]);
  var rollRadians = Math.radians(view[Math.ROLL]);

  var sp = Math.sin(pitchRadians);
  var sy = Math.sin(yawRadians);
  var sr = Math.sin(rollRadians);

  var cp = Math.cos(pitchRadians);
  var cy = Math.cos(yawRadians);
  var cr = Math.cos(rollRadians);

	if (forward)
	{
		forward[Math.X] = cp*cy;
		forward[Math.Y] = cp*sy;
		forward[Math.Z] = -sp;
	}

	if (right)
	{
		right[Math.X] = (-1*sr*sp*cy+-1*cr*-sy);
		right[Math.Y] = (-1*sr*sp*sy+-1*cr*cy);
		right[Math.Z] = -1*sr*cp;
	}

	if (up)
	{
		up[Math.X] = (cr*sp*cy+-sr*-sy);
		up[Math.Y] = (cr*sp*sy+-sr*cy);
		up[Math.Z] = cr*cp;
	}
};

Math.screenToWorld = (invViewProjection, screenCoords, screenWidth, screenHeight) => {
  var x = 2 * screenCoords[Math.X] / screenWidth - 1;
  var y = 1 - (2 * screenCoords[Math.Y] / screenHeight);
  var z = 0;
  var worldPos = vec3.fromValues(x,y,z);
  vec3.transformMat4(worldPos, worldPos, invViewProjection);

  return worldPos;
};

Math.lerp = (a, b, t) => {
  return (1 - t) * a + t * b;
};

Math.between = (a, b, c, inclusive = true) => {
  return a <= c && c <= b;
}
