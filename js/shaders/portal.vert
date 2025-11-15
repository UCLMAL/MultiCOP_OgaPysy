varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;

void main() {
    // Transform normal to world space
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    // Transform position to world space
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;

    // Calculate view direction (from surface to camera)
    vViewDirection = normalize(cameraPosition - vWorldPosition);

    // Standard vertex transformation
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
