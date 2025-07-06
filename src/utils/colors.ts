/**
 * Utilidades para manejo de colores
 */

/**
 * Determina si un color hexadecimal es claro u oscuro
 * @param hexColor - Color en formato hex (ej: "#FF5733" o "FF5733")
 * @returns true si es claro, false si es oscuro
 */

export const isLightColor = (hexColor: string): boolean => {
    const hex = hexColor.replace('#', '')
    if (hex.length !== 6) return false
    
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    return luminance > 0.5
}

export default isLightColor